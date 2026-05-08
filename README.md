# Portfolio React + API REST Express/Mongo DB

Application de gestion de portfolio avec un frontend React/Vite et une API REST
Express JS connectee a Mongo DB avec Mongoose.

## Installation

```powershell
npm.cmd install
```

Les dependances serveur installees sont:

```powershell
npm.cmd install express mongoose dotenv cors
```

## Variables d'environnement

Le fichier `.env` contient les variables utilisees par le serveur et par Vite:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fullstack_portfolio
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:5000/api/projets
VITE_ADMIN_API_URL=http://localhost:5000/api/admin
ADMIN_PASSWORD=change-moi-avant-deployer
ADMIN_SECRET=une-cle-longue-et-secrete
```

## Structure API

- `app.js`: point d'entree Express, middlewares globaux, routes et demarrage serveur.
- `config/connectdb.js`: connexion a Mongo DB via Mongoose.
- `models/projectModel.js`: schema et modele Mongoose d'un projet.
- `controllers/projectController.js`: logique metier CRUD.
- `routes/projectRoutes.js`: routes avec `express.Router`.
- `middleware/logger.js`: middleware de journalisation des requetes.
- `middleware/errorHandler.js`: middleware 404 et gestion centralisee des erreurs.

## Concepts Express utilises

- Routage avec `express.Router`: routes groupees dans `routes/projectRoutes.js`.
- Parametre de route: `GET /api/projets/:id`, recupere avec `req.params` et traite via `router.param("id", ...)`.
- Query string: `GET /api/projets?q=react&kind=Projet web&limit=10`.
- Corps de requete: `POST` et `PUT` lisent les donnees JSON dans `req.body`.
- Middlewares: `cors`, `express.json`, `express.urlencoded`, logger, 404, error handler.
- Reponses: `res.type(...)`, `res.status(...)`, `res.json(...)` et `res.send(...)`.

## Mongo DB et Mongoose

Installation Mongo DB: installer MongoDB Community Server depuis la
documentation officielle, demarrer le service MongoDB, puis garder dans `.env`
une chaine locale comme `mongodb://127.0.0.1:27017/fullstack_portfolio`.
Une autre option possible est MongoDB Atlas, avec sa chaine de connexion dans
`MONGO_URI`.

Mongo DB stocke les documents de projets dans la base `fullstack_portfolio`.
Mongoose est l'ODM utilise pour definir un schema, valider les donnees et
manipuler les documents avec un modele JavaScript.

Le modele `Project` definit:

- `slug`: identifiant unique expose comme `id` dans l'API.
- `title`, `description`, `image`, `kind`, `stack`, `link`, `points`.
- `createdAt` et `updatedAt` generes automatiquement par Mongoose.

CRUD realise:

- Ajouter un projet: `POST /api/projets`
- Retourner tous les projets: `GET /api/projets`
- Retourner un projet donne: `GET /api/projets/:id`
- Modifier un projet donne: `PUT /api/projets/:id`
- Supprimer un projet: `DELETE /api/projets/:id`

Les routes `POST`, `PUT`, `PATCH` et `DELETE` sont protegees par un token admin.
La connexion admin se fait via `POST /api/admin/login` avec `ADMIN_PASSWORD`.

## Demo

1. Demarrer Mongo DB localement ou utiliser une chaine MongoDB Atlas dans `.env`.
2. Importer les projets de depart dans Mongo DB:

```powershell
npm.cmd run seed
```

3. Lancer l'API Express:

```powershell
npm.cmd run api
```

4. Lancer le frontend React:

```powershell
npm.cmd run dev
```

Connexion admin locale: si `ADMIN_PASSWORD` n'est pas defini, le mot de passe
de developpement est `admin123`. En production, il faut obligatoirement definir
`ADMIN_PASSWORD` et `ADMIN_SECRET`.

5. Tester l'API:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
Invoke-RestMethod http://localhost:5000/api/projets
Invoke-RestMethod "http://localhost:5000/api/projets?q=windows&limit=2"
```

Exemple d'ajout:

```powershell
Invoke-RestMethod http://localhost:5000/api/projets `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"id":"api-express","title":"API Express Portfolio","description":"API REST avec Express et Mongo DB","kind":"Projet web","stack":["Express","Mongo DB","Mongoose"],"points":["Routage","Middleware","CRUD"]}'
```

## Docker

Lancer toute l'application avec Docker Compose:

```powershell
docker compose up --build
```

Services disponibles:

- Frontend React/Vite: http://localhost:5173
- API Express: http://localhost:5000
- Mongo DB: mongodb://localhost:27017/fullstack_portfolio

Concepts Docker utilises dans le projet:

- Installation et demarrage de Docker Desktop avec WSL 2.
- Images et conteneurs: `pull`, `build`, `run`, `ps`, `logs`, `exec`, `stop`,
  `rm`, `images`, `rmi`, `inspect`.
- Reseau Docker Compose personnalise par defaut avec DNS integre entre
  services: `api`, `frontend` et `mongo`.
- Dockerfile multi-stage avec les etapes `deps`, `development`, `build` et
  `production`.
- Publication Docker Hub des images `richef07/porfoliocherif-api:latest` et
  `richef07/porfoliocherif-frontend:latest`.
- Stockage avec volume nomme `mongo_data` pour Mongo DB et bind mount du code
  source en developpement.

Importer les projets de depart dans Mongo DB apres le demarrage:

```powershell
docker compose exec api npm run seed
```

Arreter les containers:

```powershell
docker compose down
```

Supprimer aussi les donnees Mongo DB locales:

```powershell
docker compose down -v
```

Connexion admin Docker en developpement: `admin123`.

### Publication sur Docker Hub

Docker Hub est deja utilise pour recuperer l'image officielle `mongo:7`.
Pour publier les images du portfolio, se connecter a Docker Hub puis taguer et pousser les images:

```powershell
docker login

docker tag porfoliocherif-api:latest richef07/porfoliocherif-api:latest
docker tag porfoliocherif-frontend:latest richef07/porfoliocherif-frontend:latest

docker push richef07/porfoliocherif-api:latest
docker push richef07/porfoliocherif-frontend:latest
```

Avec le `docker-compose.yml`, les images peuvent aussi etre construites et poussees directement:

```powershell
docker compose build
docker compose push api frontend
```

Construire l'image de production multi-stage:

```powershell
docker build --target production -t richef07/porfoliocherif-api:production .
```

Verifier les images locales:

```powershell
docker images
```

## Build

```powershell
npm.cmd run build
```

## Deploiement

- Frontend: deployer `dist/` apres `npm.cmd run build`.
- Vercel: le dossier `api/` expose les fonctions serverless
  `/api/projets`, `/api/projets/:id`, `/api/admin/login` et `/api/health`.
  Le fichier `vercel.json` renvoie les routes React vers `index.html` tout en
  laissant les fonctions API prioritaires.
- API: definir `MONGO_URI`, `ADMIN_PASSWORD` et `ADMIN_SECRET` dans les
  variables d'environnement Vercel. Sans `MONGO_URI`, l'API reste en lecture
  seule et sert les projets de depart.
- Base de donnees: utiliser MongoDB Atlas ou une instance MongoDB accessible par
  le serveur.
- Securite: ne jamais publier les valeurs reelles de `.env`.

## References

- Express - Routing: https://expressjs.com/en/guide/routing.html
- Express - Middleware: https://expressjs.com/en/guide/using-middleware
- Express - API reference: https://expressjs.com/en/api
- Mongoose - Schemas: https://mongoosejs.com/docs/guide.html
- Mongoose - Models: https://mongoosejs.com/docs/models.html
- Mongo DB - Installation: https://www.mongodb.com/docs/manual/installation/
- Mongo DB + Mongoose tutorial: https://www.mongodb.com/docs/drivers/node/current/integrations/mongoose-get-started/
