# Jenkins - Integration CI/CD du projet fil rouge

Ce document couvre les points 3.3 a 3.12 pour le projet `fullStack_portfolio`.
L'objectif est d'automatiser la validation du code, le build React/Vite, la
creation d'artefacts et, si Docker est disponible, la construction d'une image
de production.

## 3.3. Installation

Option simple pour la demo:

```powershell
docker network create jenkins
docker volume create jenkins_home
docker run --name jenkins -d `
  --restart=on-failure `
  -p 8080:8080 -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  jenkins/jenkins:lts-jdk21
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Ensuite ouvrir `http://localhost:8080`, coller le mot de passe initial,
installer les plugins recommandes et creer le premier compte administrateur.

Si Jenkins est installe directement sur Windows ou Linux, il faut aussi avoir:

- Git pour cloner le depot.
- Node.js compatible avec le projet.
- Docker Desktop ou Docker Engine si on veut activer le stage Docker.

## 3.4. Configuration

Dans `Manage Jenkins`:

- `Tools`: configurer Git et Node.js si Jenkins ne les trouve pas
  automatiquement.
- `Credentials`: ajouter les acces au depot Git si le depot est prive.
- `System`: configurer SMTP si les notifications email sont utilisees.
- `Security`: garder une authentification active et limiter les permissions.

Le projet utilise les variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fullstack_portfolio
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=/api/projets
VITE_ADMIN_API_URL=/api/admin
ADMIN_PASSWORD=change-moi-avant-deployer
ADMIN_SECRET=une-cle-longue-et-secrete
```

Les vraies valeurs ne doivent pas etre commitees. Elles doivent etre placees
dans `.env`, dans Jenkins Credentials, ou dans la configuration de la plateforme
de deploiement.

## 3.5. Gestion des plugins

Plugins utiles:

- Pipeline: execution du `Jenkinsfile`.
- Git: checkout du depot.
- GitHub Branch Source: detection automatique des branches et pull requests
  GitHub.
- NodeJS: installation/selection de Node.js depuis Jenkins.
- Docker Pipeline: execution ou construction via Docker.
- Credentials Binding: injection securisee des secrets dans les jobs.
- Email Extension: notifications personnalisees.

Installation: `Manage Jenkins` -> `Plugins` -> chercher le plugin ->
`Install`. Apres l'installation, redemarrer Jenkins si necessaire.

## 3.6. Pipelines

Le fichier ajoute a la racine du projet est `Jenkinsfile`.

Stages realises:

1. `Checkout`: Jenkins recupere le code source.
2. `Install dependencies`: execution de `npm ci`.
3. `Quality checks`: execution de `npm run test --if-present`.
4. `Build frontend`: execution de `npm run build`.
5. `Smoke check`: verification que `dist/index.html` existe.
6. `Docker image`: construction optionnelle de l'image Docker.

Le pipeline archive aussi `dist/**` pour garder le build produit par Jenkins.

## 3.7. Integration d'un depot Git

Etapes:

1. Pousser le projet sur GitHub, GitLab ou un serveur Git.
2. Dans Jenkins, creer un job `Pipeline` ou `Multibranch Pipeline`.
3. Renseigner l'URL du depot.
4. Ajouter les credentials si le depot est prive.
5. Indiquer que le script vient de `Jenkinsfile`.
6. Lancer `Build Now`.

Pour declencher automatiquement Jenkins apres un push, configurer un webhook
dans GitHub vers:

```text
http://ADRESSE_JENKINS:8080/github-webhook/
```

## 3.8. Utilisation de Docker

Le projet contient maintenant un `Dockerfile` multi-stage:

- Stage `build`: installe les dependances et construit le frontend Vite.
- Stage `runtime`: installe les dependances de production, copie l'API Express
  et copie `dist/`.

Le serveur Express a ete adapte pour servir `dist/` quand
`NODE_ENV=production`. L'image peut donc lancer l'application avec:

```powershell
docker build -t fullstack-portfolio:latest .
docker run --rm -p 5000:5000 `
  -e MONGO_URI="mongodb://host.docker.internal:27017/fullstack_portfolio" `
  -e ADMIN_PASSWORD="mot-de-passe-fort" `
  -e ADMIN_SECRET="cle-longue-et-secrete" `
  fullstack-portfolio:latest
```

Dans Jenkins, cocher le parametre `BUILD_DOCKER_IMAGE` pour activer le stage
Docker.

## 3.9. Gestion des notifications

Le `Jenkinsfile` accepte le parametre `EMAIL_RECIPIENTS`.

Si le plugin Email Extension et SMTP sont configures, Jenkins envoie un email
en cas de succes ou d'echec. Si aucun destinataire n'est donne, le pipeline se
contente d'ecrire le resultat dans la console.

## 3.10. Strategies de deploiement

Strategies possibles pour ce projet:

- Deploiement manuel controle: Jenkins construit `dist/**`, puis l'equipe le
  publie sur Netlify, Vercel ou un serveur web.
- Deploiement Docker: Jenkins construit `fullstack-portfolio:BUILD_NUMBER`,
  puis l'image est poussee vers Docker Hub, GitHub Container Registry ou ECR.
- Deploiement staging puis production: chaque push sur `develop` deploie en
  staging, chaque tag ou merge sur `main` deploie en production.
- Rollback: conserver les anciennes images Docker taguees par numero de build.

Pour une production reelle, ajouter un registry Docker et des credentials
Jenkins avant de pousser l'image.

## 3.11. Comparaison avec GitHub Actions

Jenkins:

- Tres configurable et adapte aux environnements internes.
- Nombreux plugins et controle complet de l'infrastructure.
- Demande plus d'administration: serveur, plugins, securite, sauvegardes.

GitHub Actions:

- Integre directement a GitHub.
- Plus simple a demarrer pour les projets heberges sur GitHub.
- Moins d'administration serveur, mais moins de controle si on utilise les
  runners heberges.

Pour ce projet, Jenkins est interessant pour montrer un serveur CI/CD complet,
une interface d'administration, des plugins, des credentials, Docker et des
jobs parametrables.

## 3.12. Demo

Scenario de demo:

1. Ouvrir Jenkins: `http://localhost:8080`.
2. Montrer le Dashboard, `Manage Jenkins`, `Plugins`, `Credentials` et
   `Build History`.
3. Creer un job `Pipeline` appele `fullstack-portfolio`.
4. Choisir `Pipeline script from SCM`.
5. Choisir Git, coller l'URL du depot et selectionner les credentials si besoin.
6. Verifier que `Script Path` vaut `Jenkinsfile`.
7. Lancer `Build Now`.
8. Ouvrir le build, puis `Console Output`.
9. Montrer les stages: checkout, installation, quality checks, build, smoke
   check et Docker si active.
10. Ouvrir `Artifacts` pour montrer le dossier `dist`.
11. Cocher `BUILD_DOCKER_IMAGE`, relancer le build et montrer la creation de
    l'image.

Ce qui a permis de realiser l'integration:

- `Jenkinsfile`: definit le pipeline comme du code.
- `package.json`: fournit les commandes `npm ci`, `npm run build` et les scripts
  Node/Vite.
- `Dockerfile`: cree une image de production reproductible.
- `.dockerignore`: evite de copier les fichiers inutiles dans l'image.
- Express: sert l'API et, en production, les fichiers generes dans `dist/`.
- Git: fournit le code source a Jenkins.
- Plugins Jenkins: Pipeline, Git, Docker Pipeline, Credentials et Email
  Extension.
