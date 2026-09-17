// ----------------------------------------------------------------------
// Initialisation Firebase partagée
// ----------------------------------------------------------------------
// Un seul appel à initializeApp() pour toute l'application — LoginGate.jsx
// (écran de connexion) et storagePolyfill.js (lecture/écriture Firestore)
// importent tous les deux `auth` et `db` depuis ce fichier plutôt que
// d'initialiser Firebase chacun de leur côté.
// ----------------------------------------------------------------------

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDA5cCPZO2Wjfx-8YP4WFJQIUVIc-Qqb0",
  authDomain: "ht-maintenance.firebaseapp.com",
  projectId: "ht-maintenance",
  storageBucket: "ht-maintenance.firebasestorage.app",
  messagingSenderId: "273138950416",
  appId: "1:273138950416:web:eb32be0db419dbbfe8c595",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Cache local hors-ligne : l'app continue à fonctionner brièvement sans
// réseau, et resynchronise au retour de la connexion. Échoue
// silencieusement si le navigateur ne le permet pas (ex. plusieurs
// onglets ouverts) — l'app reste utilisable, juste sans ce cache.
enableIndexedDbPersistence(db).catch(() => {});
