// ----------------------------------------------------------------------
// Polyfill pour window.storage — Firebase Firestore
// ----------------------------------------------------------------------
// L'app (App.jsx) a été construite comme artefact Claude, où window.storage
// est fourni nativement (get/set/delete/list, avec un flag "shared").
// Ce fichier reproduit la même API par-dessus Firebase Firestore, pour que
// App.jsx fonctionne à l'identique, SANS AUCUNE modification de son code.
//
// Authentification : e-mail / mot de passe, gérée par LoginGate.jsx (qui
// bloque l'affichage de l'app tant que la personne n'est pas connectée).
// Ce fichier attend simplement qu'un utilisateur soit authentifié
// (onAuthStateChanged) avant de lire/écrire quoi que ce soit — peu importe
// la méthode de connexion utilisée par LoginGate.
//
// Modèle de données Firestore :
//   - clé "personnelle" (shared=false) → document dans
//     ht-devis-facture-users/{uid}/data/{key}
//   - clé "partagée" (shared=true) → document dans
//     ht-devis-facture-shared/{key}
//   Chaque document a un seul champ "value" (la chaîne JSON telle quelle),
//   exactement comme le ferait window.storage nativement.
// ----------------------------------------------------------------------

import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase.js";

let currentUid = null;

const authReady = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUid = user.uid;
      resolve(user.uid);
    } else {
      currentUid = null;
    }
  });
});

async function ensureAuth() {
  await authReady;
  if (!currentUid) {
    throw new Error("Non connecté.");
  }
}

function docRef(key, shared) {
  return shared
    ? doc(db, "ht-devis-facture-shared", key)
    : doc(db, "ht-devis-facture-users", currentUid, "data", key);
}

function collectionRef(shared) {
  return shared
    ? collection(db, "ht-devis-facture-shared")
    : collection(db, "ht-devis-facture-users", currentUid, "data");
}

async function get(key, shared = false) {
  await ensureAuth();
  const snap = await getDoc(docRef(key, shared));
  if (!snap.exists()) {
    throw new Error(`storage: key "${key}" not found`);
  }
  return { key, value: snap.data().value, shared };
}

async function set(key, value, shared = false) {
  await ensureAuth();
  await setDoc(docRef(key, shared), { value, updatedAt: Date.now() });
  return { key, value, shared };
}

async function del(key, shared = false) {
  await ensureAuth();
  await deleteDoc(docRef(key, shared));
  return { key, deleted: true, shared };
}

async function list(prefix = "", shared = false) {
  await ensureAuth();
  const snaps = await getDocs(collectionRef(shared));
  const keys = [];
  snaps.forEach((d) => {
    if (d.id.startsWith(prefix)) keys.push(d.id);
  });
  return { keys, prefix, shared };
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = { get, set, delete: del, list };
}
