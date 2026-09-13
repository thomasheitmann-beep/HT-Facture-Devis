// ----------------------------------------------------------------------
// Polyfill pour window.storage
// ----------------------------------------------------------------------
// L'app (App.jsx) a été construite comme artefact Claude, où window.storage
// est fourni nativement (get/set/delete/list, avec un flag "shared").
// Ce fichier reproduit la même API par-dessus localStorage, pour que
// App.jsx fonctionne à l'identique une fois déployé, SANS AUCUNE
// modification de son code.
//
// ÉVOLUTIF : le jour où plusieurs personnes doivent voir les mêmes
// données en simultané, il suffit de remplacer les 4 fonctions
// ci-dessous par des appels à une vraie API (ex. fetch vers un backend
// avec une base de données). Le reste de l'application n'a pas besoin
// de changer : elle ne connaît que window.storage.get/set/delete/list.
// ----------------------------------------------------------------------

const PREFIX = "ht-devis-facture:";

function keyFor(key, shared) {
  return `${PREFIX}${shared ? "shared:" : "user:"}${key}`;
}

async function get(key, shared = false) {
  const raw = localStorage.getItem(keyFor(key, shared));
  if (raw === null) {
    throw new Error(`storage: key "${key}" not found`);
  }
  return { key, value: raw, shared };
}

async function set(key, value, shared = false) {
  localStorage.setItem(keyFor(key, shared), value);
  return { key, value, shared };
}

async function del(key, shared = false) {
  localStorage.removeItem(keyFor(key, shared));
  return { key, deleted: true, shared };
}

async function list(prefix = "", shared = false) {
  const scope = `${PREFIX}${shared ? "shared:" : "user:"}${prefix}`;
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(scope)) {
      keys.push(k.slice(`${PREFIX}${shared ? "shared:" : "user:"}`.length));
    }
  }
  return { keys, prefix, shared };
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = { get, set, delete: del, list };
}
