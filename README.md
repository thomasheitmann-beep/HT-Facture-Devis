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

## Authentification & stockage des données

L'accès à l'application est protégé par un écran de connexion e-mail /
mot de passe (`src/LoginGate.jsx`) : tant que la personne n'est pas
authentifiée auprès de Firebase, l'app (`src/App.jsx`) ne s'affiche pas.
Les comptes se créent et se gèrent dans la console Firebase (Authentication
→ Users) — ce sont les mêmes identifiants que pour les autres applications
HT Maintenance du même projet Firebase (`ht-maintenance`).

Une fois connectée, l'app utilise `window.storage` (get/set/delete/list),
l'API de stockage persistant native des artefacts Claude. Un polyfill
(`src/storagePolyfill.js`) reproduit cette même API par-dessus **Firebase
Firestore**, pour que `src/App.jsx` fonctionne à l'identique, SANS AUCUNE
modification de son code.

**Conséquence : les données sont dans le cloud (projet Firebase
`ht-maintenance`), pas seulement dans le navigateur.** Vous pouvez ouvrir
l'app sur un autre appareil, vous reconnecter, et retrouver les mêmes
données. Un cache local (IndexedDB) permet aussi de continuer à travailler
brièvement hors ligne ; les écritures se resynchronisent au retour de la
connexion.

La fonctionnalité **Sauvegarde & restauration** (onglet Paramètres) reste
disponible et recommandée pour garder une copie de secours en dehors de
Firebase.

### Ajouter ou retirer des comptes

Dans la console Firebase → Authentication → Users : bouton "Add user"
pour créer un nouvel accès (e-mail + mot de passe), ou supprimer un
utilisateur pour lui couper l'accès immédiatement.

### Passer à du temps réel partagé plus tard

Si plusieurs comptes doivent voir les mêmes données se mettre à jour
instantanément (sans recharger la page), on peut faire évoluer
`get`/`list` dans `src/storagePolyfill.js` vers `onSnapshot` de
Firestore — même principe, seul ce fichier change, `src/App.jsx` reste
intact.

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
