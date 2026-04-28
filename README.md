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

## Build

```powershell
npm.cmd run build
```

## References

- Express - Routing: https://expressjs.com/en/guide/routing.html
- Express - Middleware: https://expressjs.com/en/guide/using-middleware
- Express - API reference: https://expressjs.com/en/api
- Mongoose - Schemas: https://mongoosejs.com/docs/guide.html
- Mongoose - Models: https://mongoosejs.com/docs/models.html
- Mongo DB - Installation: https://www.mongodb.com/docs/manual/installation/
- Mongo DB + Mongoose tutorial: https://www.mongodb.com/docs/drivers/node/current/integrations/mongoose-get-started/
