# Portfolio React SPA

Ce depot contient une refonte du portfolio en **React JS** sous forme de **SPA** avec :

- composants reutilisables ;
- routage client avec React Router ;
- gestion locale de l'etat ;
- formulaire d'ajout et d'edition ;
- chargement et persistance des projets via `json-server`.

## Lancer le projet

Installer les dependances :

```powershell
npm.cmd install
```

Demarrer l'API REST factice :

```powershell
npm.cmd run api
```

Demarrer l'application React :

```powershell
npm.cmd run dev
```

Verifier la compilation de production :

```powershell
npm.cmd run build
```

## Scripts

- `npm run dev` : lance Vite en mode developpement
- `npm run build` : construit la version de production
- `npm run preview` : previsualise la version construite
- `npm run api` : demarre `json-server` sur `http://localhost:3000`

## Structure principale

- `src/App.jsx` : shell global et routes
- `src/pages/HomePage.jsx` : page d'accueil / presentation
- `src/pages/PortfolioPage.jsx` : page de la demo portfolio
- `src/components/Dossier.jsx` : composant principal de gestion
- `src/components/Projet.jsx` : carte d'un projet
- `src/components/AjouterProjet.jsx` : formulaire d'ajout / edition
- `src/components/DetaillerProjet.jsx` : affichage detaille d'un projet
- `src/services/projectsApi.js` : appels HTTP vers `json-server`
- `db.json` : base de donnees locale des projets

## Fonctionnalites couvertes

- lister les projets ;
- rechercher un projet ;
- filtrer par categorie ;
- afficher le detail d'un projet via le routage ;
- ajouter un projet ;
- editer un projet ;
- supprimer un projet ;
- recharger les donnees depuis le serveur factice.
