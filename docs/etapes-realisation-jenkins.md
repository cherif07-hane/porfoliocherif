# Etapes suivies pour realiser l'integration Jenkins

Ce fichier resume toutes les etapes suivies pour integrer Jenkins dans le
projet `fullStack_portfolio`.

## 1. Analyse du projet

J'ai d'abord regarde la structure du projet pour comprendre sa technologie et
son mode de fonctionnement.

Constat:

- Le projet est une application React avec Vite pour le frontend.
- Le backend est une API Express.
- MongoDB est utilise avec Mongoose.
- Les scripts principaux sont dans `package.json`.

Commandes verifiees:

```powershell
Get-ChildItem -Force
rg --files
Get-Content package.json
```

Ce que cela a permis:

- Identifier les commandes disponibles: `npm run build`, `npm run api`,
  `npm run dev`, `npm run seed`.
- Comprendre qu'un pipeline Jenkins devait installer les dependances, construire
  le frontend et produire un artefact `dist/`.

## 2. Verification du build existant

Avant d'ajouter Jenkins, j'ai verifie que le projet pouvait deja etre construit
correctement.

Commande utilisee:

```powershell
npm.cmd run build
```

Resultat:

- Le build Vite s'est execute correctement.
- Le dossier `dist/` a ete genere.

Ce que cela a permis:

- Confirmer que Jenkins pouvait utiliser la meme commande pour construire le
  projet automatiquement.

## 3. Ajout du Jenkinsfile

J'ai cree un fichier `Jenkinsfile` a la racine du projet.

Son role:

- Decrire le pipeline Jenkins comme du code.
- Automatiser les etapes de validation et de build.
- Archiver le dossier `dist/`.
- Permettre la construction Docker en option.
- Permettre les notifications email en option.

Stages ajoutes:

1. `Checkout`: recuperation du code source depuis Git.
2. `Install dependencies`: installation avec `npm ci`.
3. `Quality checks`: execution de `npm run test --if-present`.
4. `Build frontend`: execution de `npm run build`.
5. `Smoke check`: verification que `dist/index.html` existe.
6. `Docker image`: construction optionnelle de l'image Docker.

Ce que cela a permis:

- Jenkins peut executer automatiquement le cycle CI/CD du projet.
- Le pipeline est versionne dans Git avec le code source.

## 4. Ajout de Docker

J'ai ajoute un fichier `Dockerfile` pour containeriser le projet.

Structure du Dockerfile:

- Stage `build`: installe les dependances et construit le frontend.
- Stage `runtime`: installe seulement les dependances de production et lance
  l'application Express.

Commande prevue:

```powershell
docker build -t fullstack-portfolio:latest .
```

Ce que cela a permis:

- Preparer une image de production reproductible.
- Faciliter un futur deploiement sur un serveur, Docker Hub, GitHub Container
  Registry, AWS ECR ou une plateforme cloud.

## 5. Ajout du fichier .dockerignore

J'ai ajoute `.dockerignore` pour eviter de copier dans l'image Docker les
fichiers inutiles ou sensibles.

Elements ignores:

- `node_modules`
- `dist`
- `.git`
- `.env`
- fichiers de logs
- dossiers de cache
- dossiers d'editeurs

Ce que cela a permis:

- Rendre l'image Docker plus propre.
- Eviter d'envoyer des secrets comme `.env` dans l'image.
- Reduire le poids du contexte Docker.

## 6. Adaptation du serveur Express

J'ai modifie `app.js` pour que le serveur Express puisse servir le frontend en
production.

Modification principale:

- En mode developpement, `/` retourne toujours le message API.
- En mode production, Express sert les fichiers du dossier `dist/`.
- Les routes React sont redirigees vers `dist/index.html`.
- Les routes `/api` restent reservees a l'API.

Ce que cela a permis:

- L'image Docker peut lancer l'API et le frontend avec un seul serveur Node.
- Le build Jenkins produit par `npm run build` devient directement deployable.

## 7. Redaction du guide Jenkins complet

J'ai cree le fichier `docs/jenkins.md`.

Il contient les sections demandees:

- 3.3. Installation
- 3.4. Configuration
- 3.5. Gestion des plugins
- 3.6. Pipelines
- 3.7. Integration d'un depot Git
- 3.8. Utilisation de Docker
- 3.9. Gestion des notifications
- 3.10. Strategies de deploiement
- 3.11. Comparaison avec GitHub Actions
- 3.12. Demo

Ce que cela a permis:

- Avoir un support de presentation clair.
- Expliquer Jenkins avec le projet fil rouge, pas seulement avec de la theorie.

## 8. Verification apres implementation

J'ai relance les verifications apres les modifications.

Commandes utilisees:

```powershell
npm.cmd run build
npm.cmd run test --if-present
node -e "const fs=require('fs'); if (!fs.existsSync('dist/index.html')) process.exit(1); console.log('dist/index.html OK');"
git diff --check
```

Resultats:

- `npm run build` fonctionne.
- `npm run test --if-present` fonctionne.
- Le fichier `dist/index.html` existe apres le build.
- `git diff --check` ne signale pas d'erreur bloquante.

## 9. Installation de Jenkins avec Docker

J'ai installe Jenkins avec Docker Desktop.

Commandes utilisees:

```powershell
docker info
docker network create jenkins
docker volume create jenkins_home
docker run --name jenkins -d `
  --restart=on-failure `
  --network jenkins `
  -p 8080:8080 -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  jenkins/jenkins:lts-jdk21
```

Resultat:

- L'image `jenkins/jenkins:lts-jdk21` a ete telechargee.
- Le conteneur `jenkins` a ete cree et demarre.
- Le volume `jenkins_home` garde les donnees Jenkins.
- Le reseau Docker `jenkins` a ete cree.
- Jenkins est accessible sur `http://localhost:8080`.

Verification:

```powershell
docker ps --filter name=jenkins
Invoke-WebRequest -UseBasicParsing http://localhost:8080/login
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Ce que cela a permis:

- Confirmer que Jenkins est bien lance.
- Recuperer le mot de passe initial de l'assistant d'installation.
- Ouvrir l'interface Jenkins dans le navigateur.

## 10. Verification Docker du projet

Apres le demarrage de Docker Desktop, j'ai aussi verifie que l'image Docker du
projet pouvait etre construite.

Commande utilisee:

```powershell
docker build -t fullstack-portfolio:jenkins-demo .
```

Resultat:

- L'image `fullstack-portfolio:jenkins-demo` a ete construite correctement.
- Le build Vite a ete execute dans Docker.
- Le dossier `dist/` a ete copie dans l'image finale.

## 11. Ce qui a permis de realiser l'integration

Les elements importants sont:

- `package.json`: contient les commandes npm utilisees par Jenkins.
- `Jenkinsfile`: definit le pipeline CI/CD.
- `Dockerfile`: prepare le deploiement en conteneur.
- `.dockerignore`: protege les fichiers inutiles ou sensibles.
- `app.js`: sert l'API et le frontend compile en production.
- Docker Desktop: permet d'executer Jenkins et de construire l'image du projet.
- Git: permet a Jenkins de recuperer le code source.
- Plugins Jenkins: Pipeline, Git, Docker Pipeline, Credentials Binding et Email
  Extension.

## 12. Resultat final

A la fin, le projet contient:

- Une integration Jenkins fonctionnelle avec `Jenkinsfile`.
- Un guide Jenkins complet dans `docs/jenkins.md`.
- Un resume des etapes suivies dans ce fichier.
- Une configuration Docker prete pour la production.
- Une application Express capable de servir le frontend compile.
- Une installation Jenkins active sur `http://localhost:8080`.

Le scenario final est donc:

1. Le developpeur pousse le code sur Git.
2. Jenkins recupere le depot.
3. Jenkins installe les dependances.
4. Jenkins lance les controles disponibles.
5. Jenkins construit le frontend.
6. Jenkins verifie que `dist/index.html` existe.
7. Jenkins archive `dist/`.
8. Jenkins peut construire une image Docker si l'option est activee.
9. Jenkins peut envoyer une notification email si SMTP est configure.
