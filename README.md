# HT Maintenance — Devis, Factures & Commandes d'achat

Application de gestion des devis, factures et commandes d'achat fournisseur
pour HT Maintenance. Projet React + Vite, prêt à déployer sur Vercel.

## Déploiement sur Vercel (le plus simple)

1. Créez un dépôt Git (GitHub, GitLab...) et poussez ce dossier dedans :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <URL_DE_VOTRE_DEPOT>
   git push -u origin main
   ```
2. Sur [vercel.com](https://vercel.com), cliquez sur **Add New → Project**,
   importez ce dépôt.
3. Vercel détecte automatiquement Vite : laissez les réglages par défaut
   (**Build Command**: `vite build`, **Output Directory**: `dist`).
4. Cliquez sur **Deploy**. Votre site est en ligne en 1 à 2 minutes, avec
   une URL du type `https://votre-projet.vercel.app`.

Vous pouvez ensuite relier un nom de domaine personnalisé dans les
réglages du projet Vercel (**Settings → Domains**).

## Développement local

```bash
npm install
npm run dev
```
Ouvre l'app sur http://localhost:5173

## Build de production (test local)

```bash
npm run build
npm run preview
```

## Stockage des données

L'application utilise `window.storage` (get/set/delete/list), l'API de
stockage persistant native des artefacts Claude. Pour fonctionner hors de
Claude, un polyfill (`src/storagePolyfill.js`) reproduit cette même API
par-dessus le `localStorage` du navigateur.

**Conséquence importante : les données sont stockées uniquement dans le
navigateur de la personne qui utilise le site.** Chaque utilisateur (ou
chaque appareil) a sa propre base de devis/factures/commandes, non
partagée. C'est adapté à un usage mono-utilisateur.

### Passer à un usage multi-utilisateur plus tard

Le jour où plusieurs personnes doivent voir les mêmes données en temps
réel, il suffit de modifier les 4 fonctions de
`src/storagePolyfill.js` (`get`, `set`, `del`, `list`) pour qu'elles
appellent une vraie API backend (avec une base de données) au lieu de
`localStorage`. **Aucune autre partie de l'application n'a besoin
d'être modifiée** : tout le reste du code (`src/App.jsx`) ne connaît que
`window.storage.get/set/delete/list` et n'a pas connaissance de la façon
dont les données sont réellement stockées.

Options courantes pour cette étape : Vercel Postgres / Vercel KV,
Supabase, Firebase, ou une API que vous développez vous-même.

## Structure du projet

```
├── index.html            Page HTML d'entrée
├── src/
│   ├── main.jsx           Point d'entrée React
│   ├── App.jsx             Application complète (devis, factures, commandes, CGV...)
│   ├── storagePolyfill.js  Stockage (localStorage → à remplacer pour du multi-utilisateur)
│   └── index.css           Styles Tailwind
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```
