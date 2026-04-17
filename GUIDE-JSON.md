# Guide React JS et demo Portfolio

## 1) Presentation de React JS

React JS est une bibliotheque JavaScript concue pour construire des interfaces utilisateur dynamiques a partir de composants reutilisables.  
Dans ce projet, React est utilise pour transformer le portfolio en **SPA (Single Page Application)** : la navigation est fluide, les composants se mettent a jour sans recharger toute la page, et l'etat de l'interface reste maitrise.

Points importants :

- React s'appuie sur une logique declarative : on decrit ce qu'on veut afficher selon l'etat courant.
- L'interface est decoupee en composants reutilisables.
- Les donnees circulent du parent vers l'enfant via les props.
- L'etat local permet de gerer la recherche, l'edition, le chargement et les formulaires.
- React fonctionne tres bien avec des API HTTP et des outils comme React Router.

## 2) Mise en place de l'environnement de developpement

La refonte a ete faite avec **React + Vite + React Router + json-server**.

### Installation

```powershell
npm.cmd install
```

### Lancer le serveur REST factice

```powershell
npm.cmd run api
```

API utilisee :

```txt
http://localhost:3000/projets
```

### Lancer l'application React

```powershell
npm.cmd run dev
```

### Construire l'application

```powershell
npm.cmd run build
```

### Dependances principales

- `react` : creation de l'interface en composants
- `react-dom` : rendu React dans le navigateur
- `react-router-dom` : routage client
- `vite` : serveur de developpement et build
- `json-server` : API REST factice

## 3) Concepts

### a) JSX

Le JSX est une syntaxe proche du HTML qui permet d'ecrire l'interface dans les composants React.

Exemples d'idees a retenir :

- on ecrit des **elements** JSX comme `<section>`, `<article>`, `<Projet />`
- les **attributs** ressemblent a HTML mais certains changent :
  `class` devient `className`
- les **enfants** d'un element sont places entre les balises
- on peut inserer des expressions JavaScript avec `{ ... }`
- toutes les balises doivent etre correctement fermees
- un composant retourne en general un seul element racine

Exemple :

```jsx
<article className="project-card">
  <h3>{project.title}</h3>
  <img src={project.image} alt={project.title} />
</article>
```

### b) Composants

Un composant est une fonction React qui retourne du JSX.

Dans cette application, la decomposition principale est :

- `App` : shell global et routes
- `Dossier` : composant central de gestion des projets
- `Projet` : affichage d'une carte projet
- `AjouterProjet` : formulaire d'ajout / edition
- `DetaillerProjet` : affichage complet d'un projet
- `HomePage` et `PortfolioPage` : pages de l'application

Avantage :

- code plus lisible ;
- reutilisation facile ;
- separation des responsabilites.

### c) Props

Les props servent a transmettre des informations d'un composant parent vers un composant enfant.

Exemples dans cette application :

- `Dossier` envoie un `project` au composant `Projet`
- `Dossier` envoie `onDelete`, `onEdit` et `onSubmit`
- `DetaillerProjet` recoit le projet selectionne et une fonction `onEdit`

Exemple :

```jsx
<Projet
  project={project}
  onDelete={handleDeleteProject}
  onEdit={handleStartEdit}
/>
```

### d) Etat local

L'etat local est gere avec `useState`.

Dans `Dossier`, on stocke par exemple :

- la liste des projets ;
- le texte de recherche ;
- le filtre par categorie ;
- le projet en cours d'edition ;
- les messages de succes ou d'erreur.

Dans `AjouterProjet`, l'etat local contient les champs du formulaire.

Pourquoi c'est utile :

- React re-render automatiquement l'interface quand l'etat change ;
- chaque composant garde ses propres donnees locales.

### e) Afficher une liste de composants

Pour afficher plusieurs projets, on utilise `map()` sur un tableau :

```jsx
{visibleProjects.map((project) => (
  <Projet
    key={project.id}
    project={project}
    onDelete={handleDeleteProject}
    onEdit={handleStartEdit}
  />
))}
```

Points a retenir :

- chaque element rendu dans une liste doit avoir une prop `key` unique ;
- on peut combiner `filter()` puis `map()` pour rechercher et afficher.

### f) Affichage conditionnel

L'affichage conditionnel permet d'afficher des blocs selon une condition.

Exemples dans la demo :

- afficher `Chargement des projets...` pendant la recuperation HTTP
- afficher un message d'erreur si `json-server` n'est pas disponible
- afficher le detail si un projet est selectionne
- afficher un message vide si aucun projet ne correspond a la recherche

Exemple :

```jsx
{status === "loading" ? <p>Chargement des projets...</p> : null}
```

### g) Evenements

Les evenements React permettent de reagir aux actions utilisateur :

- `onClick`
- `onChange`
- `onSubmit`

Exemples dans le projet :

- cliquer sur `Supprimer`
- cliquer sur `Editer`
- taper dans le champ de recherche
- soumettre le formulaire d'ajout

### h) Formulaires

Le composant `AjouterProjet` utilise un formulaire controle :

- chaque champ est lie a l'etat local ;
- `onChange` met a jour l'etat ;
- `onSubmit` prepare les donnees et les envoie au parent ;
- le meme composant sert pour l'ajout et l'edition.

Champs geres :

- identifiant ;
- libelle ;
- image ;
- type ;
- stack ;
- description ;
- lien ;
- points forts.

### i) Communiquer avec un serveur HTTP

Le fichier `src/services/projectsApi.js` centralise les appels HTTP avec `fetch()`.

Operations implementees :

- `GET /projets`
- `POST /projets`
- `PUT /projets/:id`
- `DELETE /projets/:id`

Dans `Dossier`, `useEffect` est utilise pour charger les projets au montage du composant.  
Les actions d'ajout, modification et suppression mettent ensuite a jour le serveur puis l'etat local React.

### j) Routage

Le routage est gere avec `react-router-dom`.

Elements utilises :

- `BrowserRouter`
- `Routes`
- `Route`
- `NavLink`
- `Link`
- `useParams`
- `useNavigate`

Routes principales :

- `/` : accueil
- `/projets` : gestion du portfolio
- `/projets/:projectId` : detail d'un projet

Dans la liste, le libelle d'un projet est une ancre React Router. Son clic affiche les informations completes du projet dans `DetaillerProjet`.

## 4) References

Sources officielles recommandees :

- React Learn : https://react.dev/learn
- Writing Markup with JSX : https://react.dev/learn/writing-markup-with-jsx
- Passing Props to a Component : https://react.dev/learn/passing-props-to-a-component
- State: A Component's Memory : https://react.dev/learn/state-a-components-memory
- Rendering Lists : https://react.dev/learn/rendering-lists
- Conditional Rendering : https://react.dev/learn/conditional-rendering
- Responding to Events : https://react.dev/learn/responding-to-events
- React `<input>` : https://react.dev/reference/react-dom/components/input
- React `useEffect` : https://react.dev/reference/react/useEffect
- Vite Getting Started : https://vite.dev/guide/
- React Router Routing : https://reactrouter.com/start/library/routing
- json-server : https://github.com/typicode/json-server

## 5) Demo

### Objectif

Realiser une application Web SPA de gestion de portfolio avec React JS.

### Prototype fonctionnel

L'application finale comporte :

- une page d'accueil de presentation ;
- une page de gestion du portfolio ;
- une liste de projets ;
- un formulaire d'ajout / edition ;
- un panneau de detail du projet selectionne.

### Decomposition de l'application

- `App` : structure generale
- `HomePage` : presentation
- `PortfolioPage` : page de demonstration
- `Dossier` : composant principal de gestion
- `Projet` : carte projet
- `AjouterProjet` : creation / mise a jour
- `DetaillerProjet` : affichage detaille
- `projectsApi` : couche HTTP

### Composants demandes

#### Composant `Dossier`

Responsabilites :

- stocker la liste des projets ;
- charger les projets depuis le serveur ;
- rechercher ;
- filtrer ;
- ajouter ;
- supprimer ;
- lancer l'edition ;
- piloter le detail.

#### Composant `Projet`

Responsabilites :

- afficher le libelle ;
- afficher l'image ;
- afficher les technologies ;
- proposer le bouton `Supprimer` ;
- proposer le bouton `Editer` ;
- rendre le titre cliquable pour afficher le detail.

#### Composant `AjouterProjet`

Responsabilites :

- saisir les informations d'un projet ;
- envoyer les donnees a `Dossier` ;
- servir aussi a l'edition d'un projet existant.

#### Composant `DetaillerProjet`

Responsabilites :

- afficher les informations completes du projet ;
- afficher `Annuler` pour masquer le detail ;
- afficher `Editer` pour renvoyer le projet dans le formulaire.

### Fonctionnalites realisees

- prototypage de la SPA ;
- decomposition en composants ;
- affichage de la liste des projets ;
- recherche d'un projet ;
- filtrage par categorie ;
- ajout d'un projet ;
- suppression d'un projet ;
- detail d'un projet ;
- annulation du detail ;
- edition d'un projet ;
- persistance avec `json-server`.

### Fichiers principaux de la demo

- `src/App.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/PortfolioPage.jsx`
- `src/components/Dossier.jsx`
- `src/components/Projet.jsx`
- `src/components/AjouterProjet.jsx`
- `src/components/DetaillerProjet.jsx`
- `src/services/projectsApi.js`
- `db.json`

### Lancer la demo

1. Installer les dependances : `npm.cmd install`
2. Lancer l'API : `npm.cmd run api`
3. Lancer React : `npm.cmd run dev`
4. Ouvrir l'URL fournie par Vite dans le navigateur

## Conclusion

Cette refonte montre une mise en pratique concrete des notions React JS demandees :

- JSX ;
- composants ;
- props ;
- etat local ;
- listes ;
- affichage conditionnel ;
- evenements ;
- formulaires ;
- communication HTTP ;
- routage.
