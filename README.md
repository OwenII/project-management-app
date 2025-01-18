# 📖 Guide Complet : Application de Gestion de Projets

Bienvenue sur notre plateforme de gestion de projets ! Voici un récapitulatif qui vous permettra d’installer, de découvrir et de comprendre toutes les fonctionnalités essentielles de l’application. Nous espérons que cette présentation saura vous éclairer sur les multiples possibilités offertes. 🤝

---

## 1. Installation et Démarrage 🚀

### Prérequis
- **Docker** doit être installé sur votre ordinateur.  
- **Node.js** (incluant npm) pour exécuter la partie visible (interface de navigation).

### Étapes d’installation

1. **Cloner le projet**  
   Téléchargez le contenu du dépôt disponible ici :  
   ```
   git clone https://github.com/OwenII/project-management-app.git
   ```
2. **Accéder au dossier de l’application**  
   ```
   cd project-management-app
   ```
3. **Préparer et lancer l’API**  
   Dans le dossier principal, lancez :  
   ```
   docker-compose up --build
   ```
   - Les tests unitaires sont alors exécutés. Vous devriez voir la mention `5 passed in ...s`.  
   - Lorsque l’API est prête, un message similaire à ceci apparaît :  
     ```
     INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
     ```

4. **Démarrer l’interface utilisateur**  
   - Rendez-vous ensuite dans le dossier `client` :  
     ```
     cd client
     ```
   - Installez les dépendances et lancez l’interface :  
     ```
     npm install
     npm start
     ```
   - Si tout se passe bien, vous obtiendrez un message du type :  
     ```
     Compiled successfully!
     
     You can now view client in the browser.
     
       Local:            http://localhost:3000
       On Your Network:  http://192.168.1.32:3000
     ```

5. **Accéder à l’application**  
   Ouvrez votre navigateur favori et rendez-vous à l’adresse :  
   ```
   http://localhost:3000/
   ```
   🎉 **Félicitations**, vous êtes prêt(e) à découvrir l’outil !

---

## 2. Aperçu des Fonctionnalités ✨

Une fois l’application lancée, vous pouvez :

### ➡️ Créer ou rejoindre un compte
- Cliquez sur le bouton en haut à droite pour vous **connecter** ou **créer un compte**.  
- Renseignez votre nom d’utilisateur et votre adresse e-mail, puis gérez facilement vos projets personnels.

### ➡️ Gérer vos Projets
- Consultez la **liste des projets** existants.  
- Créez un nouveau projet en indiquant son nom et sa description.  
- Modifiez ou supprimez vos propres projets si besoin (idéal pour vous adapter à l’évolution de votre organisation).

### ➡️ Organiser vos Tâches
- Une fois à l’intérieur d’un projet, ajoutez des **tâches** (à faire, en cours, terminées).  
- Mettez à jour leur statut pour suivre aisément votre avancement.  
- Filtrez vos tâches selon votre progression (TODO, IN_PROGRESS, DONE).

### ➡️ Consulter vos Tâches Personnelles
- Accédez à la section « Mes Tâches » pour voir l’ensemble de vos tâches, tous projets confondus.  
- Appliquez des filtres (par nom ou par statut) afin de mieux vous organiser.

### ➡️ Échanger et Collaborer
- Chaque projet dispose d’un **espace de commentaires** pour discuter avec les personnes impliquées.    
- Vous pouvez modifier ou supprimer vos propres commentaires si nécessaire.

### ➡️ Gérer votre Profil
- Mettez à jour votre nom d’utilisateur quand vous le souhaitez.  
- Supprimez votre compte, si tel est votre choix, après confirmation (cette action est irréversible 😱).

---

## 3. Détails du Schéma GraphQL 🏛️

L’application repose sur un schéma **GraphQL** structuré pour gérer les entités principales et leurs interactions. 

---

### **Types (Structures de Données)**
Les types définissent les entités de l’application et leurs propriétés. Chaque type correspond à un aspect clé de l’application :

#### **User (Utilisateur)** 👤
Représente une personne enregistrée sur la plateforme.  
- `id` : Identifiant unique de l’utilisateur (type : ID).  
- `email` : Adresse e-mail de l’utilisateur (type : String).  
- `username` : Nom d’utilisateur unique (type : String).  

#### **Project (Projet)** 📂
Représente un projet créé par un utilisateur.  
- `id` : Identifiant unique du projet (type : ID).  
- `name` : Nom du projet (type : String).  
- `description` : Description facultative du projet (type : String).  
- `ownerId` : Identifiant de l’utilisateur propriétaire du projet (type : Int).  

#### **Task (Tâche)** ✅
Représente une tâche associée à un projet.  
- `id` : Identifiant unique de la tâche (type : ID).  
- `title` : Titre de la tâche (type : String).  
- `status` : Statut de la tâche (type : String, valeurs possibles : `TODO`, `IN_PROGRESS`, `DONE`).  
- `projectId` : Identifiant du projet auquel cette tâche est associée (type : Int).  

#### **Comment (Commentaire)** 💬
Représente un commentaire lié à un projet ou à une tâche.  
- `id` : Identifiant unique du commentaire (type : ID).  
- `content` : Contenu du commentaire (type : String).  
- `authorId` : Identifiant de l’utilisateur ayant écrit le commentaire (type : Int).  
- `projectId` : Identifiant du projet auquel le commentaire est associé (type : Int, facultatif).  
- `taskId` : Identifiant de la tâche à laquelle le commentaire est associé (type : Int, facultatif).  
- `author` : Objet utilisateur représentant l’auteur du commentaire.  

---

### **Requêtes (Queries)**
Les requêtes permettent d’extraire des informations depuis l’application. Voici les principales :

#### **Liste des Projets**
- **Query** : `projects(filter: String): [Project!]!`  
  Renvoie une liste de projets, filtrés par nom si un critère est fourni.  
  Exemple : récupérer tous les projets contenant "Marketing" dans leur nom.

#### **Détails d’un Projet**
- **Query** : `project(id: Int!): Project`  
  Renvoie les informations détaillées d’un projet spécifique.  
  Exemple : récupérer le nom, la description et les tâches d’un projet précis.

#### **Liste des Tâches**
- **Query** : `tasks: [Task!]!`  
  Retourne toutes les tâches existantes, indépendamment de leur projet.

#### **Détails d’une Tâche**
- **Query** : `task(id: Int!): Task`  
  Fournit les informations d’une tâche précise (titre, statut, projet associé).

#### **Liste des Utilisateurs**
- **Query** : `users: [User!]!`  
  Renvoie tous les utilisateurs enregistrés sur la plateforme.

#### **Détails d’un Utilisateur**
- **Query** : `user(id: Int!): User`  
  Permet de consulter les informations d’un utilisateur spécifique.

#### **Commentaires Associés à un Projet**
- **Query** : `commentsByProject(projectId: Int!): [Comment!]!`  
  Renvoie tous les commentaires liés à un projet donné.  
  Exemple : voir les échanges entre membres d’une équipe dans le cadre d’un projet.

---

### **Mutations**
Les mutations permettent de modifier ou d’ajouter des données sur la plateforme. Voici les actions principales :

#### **Authentification**
- **Mutation** : `login(email: String!, password: String!): LoginResult!`  
  Permet de se connecter en utilisant une adresse e-mail et un mot de passe. Renvoie un **jeton de session** et les informations de l’utilisateur connecté.

#### **Gestion des Projets**
- **Créer un Projet** :  
  `createProject(name: String!, description: String, ownerId: Int!): Project!`  
  Ajoute un nouveau projet à la liste d’un utilisateur.

- **Mettre à jour un Projet** :  
  `updateProject(id: Int!, name: String, description: String): Project!`  
  Modifie les détails d’un projet existant.

- **Supprimer un Projet** :  
  `deleteProject(id: Int!): Boolean!`  
  Supprime un projet et toutes les tâches/commentaires associés.

#### **Gestion des Tâches**
- **Créer une Tâche** :  
  `createTask(title: String!, status: String!, projectId: Int!): Task!`  
  Ajoute une tâche à un projet spécifique.

- **Mettre à jour une Tâche** :  
  `updateTask(id: Int!, title: String, status: String): Task!`  
  Modifie les informations ou le statut d’une tâche.

- **Supprimer une Tâche** :  
  `deleteTask(id: Int!): Boolean!`  
  Supprime une tâche.

#### **Gestion des Commentaires**
- **Ajouter un Commentaire** :  
  `createComment(content: String!, authorId: Int!, projectId: Int, taskId: Int): Comment!`  
  Ajoute un commentaire à un projet ou une tâche.

- **Modifier un Commentaire** :  
  `updateComment(id: Int!, content: String!): Comment!`  
  Met à jour le contenu d’un commentaire existant.

- **Supprimer un Commentaire** :  
  `deleteComment(id: Int!): Comment!`  
  Supprime un commentaire.

#### **Gestion des Utilisateurs**
- **Créer un Utilisateur** :  
  `createUser(email: String!, username: String!, password: String!): User!`  
  Ajoute un nouveau compte utilisateur.

- **Mettre à jour un Utilisateur** :  
  `updateUser(id: Int!, username: String!): User!`  
  Change le nom d’utilisateur.

- **Supprimer un Compte** :  
  `deleteUser(id: Int!): Boolean!`  
  Supprime définitivement un utilisateur et ses contributions.

---

### Exemple d’Interaction GraphQL ✏️

**Créer un Projet :**
```graphql
mutation {
  createProject(name: "Projet Test", description: "Un projet pour démonstration", ownerId: 1) {
    id
    name
    description
  }
}
```

**Récupérer les Projets :**
```graphql
query {
  projects(filter: "Test") {
    id
    name
    description
  }
}
```

**Ajouter une Tâche à un Projet :**
```graphql
mutation {
  createTask(title: "Préparer la présentation", status: "TODO", projectId: 1) {
    id
    title
    status
  }
}
```

---

