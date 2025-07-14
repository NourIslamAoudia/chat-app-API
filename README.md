# 💬 Chat App API - Backend

## 📋 Table des Matières
- [Vue d'ensemble](#vue-densemble)
- [Architecture du Projet](#architecture-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation et Configuration](#installation-et-configuration)
- [Structure des Fichiers](#structure-des-fichiers)
- [Modèles de Données](#modèles-de-données)
- [API Endpoints](#api-endpoints)
- [Système d'Authentification](#système-dauthentification)
- [Gestion des Messages](#gestion-des-messages)
- [Gestion des Images](#gestion-des-images)
- [Erreurs Identifiées et Corrections](#erreurs-identifiées-et-corrections)
- [Étapes pour Démarrer](#étapes-pour-démarrer)
- [TODO et Améliorations](#todo-et-améliorations)

## 🔍 Vue d'ensemble

Cette API backend est conçue pour une application de chat en temps réel. Elle permet aux utilisateurs de :
- S'inscrire et se connecter de manière sécurisée
- Envoyer et recevoir des messages texte
- Partager des images dans les conversations
- Mettre à jour leur profil avec une photo

## 🏗️ Architecture du Projet

```
back-end/
├── package.json                 # Dépendances et scripts
├── src/
│   ├── index.js                # Point d'entrée de l'application
│   ├── controllers/            # Logique métier
│   │   ├── auth.controller.js  # Gestion authentification
│   │   └── message.controller.js # Gestion des messages
│   ├── lib/                    # Utilitaires et configurations
│   │   ├── cloudinary.js       # Configuration Cloudinary
│   │   ├── db.js              # Connexion MongoDB
│   │   └── util.js            # Fonctions utilitaires (JWT)
│   ├── middleware/             # Middlewares personnalisés
│   │   └── auth.middleware.js  # Protection des routes
│   ├── models/                 # Schémas de base de données
│   │   ├── message.model.js    # Modèle Message
│   │   └── user.model.js       # Modèle User
│   └── routers/               # Définition des routes
│       ├── auth.route.js       # Routes d'authentification
│       └── message.route.js    # Routes des messages
```

## 🛠️ Technologies Utilisées

### Backend Framework
- **Express.js** : Framework web pour Node.js
- **Node.js** : Environnement d'exécution JavaScript

### Base de Données
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM (Object Document Mapper) pour MongoDB

### Authentification et Sécurité
- **JWT (jsonwebtoken)** : Tokens d'authentification
- **bcrypt** : Hashage des mots de passe
- **cookie-parser** : Gestion des cookies

### Upload d'Images
- **Cloudinary** : Service cloud pour la gestion d'images

### Autres Dépendances
- **cors** : Gestion des requêtes cross-origin
- **dotenv** : Variables d'environnement
- **express-async-handler** : Gestion des erreurs async/await
- **socket.io** : Communication temps réel (à implémenter)

## ⚙️ Installation et Configuration

### 1. Prérequis
- Node.js (version 14 ou supérieure)
- MongoDB (local ou cloud)
- Compte Cloudinary

### 2. Installation des dépendances
```bash
cd back-end
npm install
```

### 3. Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
# Port du serveur
PORT=3000

# Base de données MongoDB
MONGOODB_URL=mongodb://localhost:27017/chatapp
# OU pour MongoDB Atlas :
# MONGOODB_URL=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=votre_jwt_secret_tres_securise_et_long

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### 4. Démarrage du serveur
```bash
npm run dev
```

## 📁 Structure des Fichiers Détaillée

### 📄 `src/index.js` - Point d'entrée
```javascript
// Configuration du serveur Express
// Middlewares globaux (JSON, cookies, CORS)
// Définition des routes principales
// Démarrage du serveur et connexion à la DB
```

**Fonctionnalités :**
- Configuration CORS pour le frontend (port 5173)
- Middlewares pour parser JSON et cookies
- Routes d'authentification (`/api/auth`)
- Routes de messages (`/api/message`)

### 📄 `src/lib/db.js` - Connexion Base de Données
```javascript
// Connexion à MongoDB via Mongoose
// Gestion des erreurs de connexion
```

**⚠️ ERREUR IDENTIFIÉE :** Variable mal nommée
- **Problème :** `process.env.MONGOODB_URL` (trois "O")
- **Solution :** Devrait être `process.env.MONGODB_URL` (deux "O")

### 📄 `src/lib/util.js` - Utilitaires JWT
```javascript
// Génération de tokens JWT
// Configuration des cookies sécurisés
```

**Fonctionnalités :**
- Génère un token JWT avec l'ID utilisateur
- Configure un cookie HTTP-only sécurisé
- Expiration : 24 heures

### 📄 `src/lib/cloudinary.js` - Configuration Images
```javascript
// Configuration du service Cloudinary
// Upload et gestion d'images
```

## 🗃️ Modèles de Données

### 👤 User Model (`user.model.js`)
```javascript
{
  email: String (unique, required),
  fullName: String (required),
  password: String (required, hashé),
  profilPic: String (URL Cloudinary, optionnel),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 💬 Message Model (`message.model.js`)
```javascript
{
  senderId: String (required, ref: 'User'),
  receiverId: String (required, ref: 'User'),
  text: String (optionnel),
  image: String (URL Cloudinary, optionnel),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**⚠️ PROBLÈME IDENTIFIÉ :** Type de données incorrect
- **Problème :** `senderId` et `receiverId` sont de type `String`
- **Solution :** Devraient être de type `mongoose.Schema.Types.ObjectId`

## 🛡️ Système d'Authentification

### Middleware de Protection (`auth.middleware.js`)
```javascript
// Vérification du token JWT dans les cookies
// Récupération des informations utilisateur
// Protection des routes privées
```

**⚠️ ERREUR IDENTIFIÉE :** Faute de frappe
- **Ligne 14 :** `"Token is Invalide"` → `"Token is Invalid"`
- **Ligne 21 :** `"erro in the middleware"` → `"error in the middleware"`

### Contrôleur d'Authentification (`auth.controller.js`)

#### 📝 `POST /api/auth/signup`
**Fonctionnalité :** Inscription d'un nouvel utilisateur
```javascript
// 1. Validation des données (email, nom, mot de passe)
// 2. Vérification de l'unicité de l'email
// 3. Hashage du mot de passe avec bcrypt
// 4. Création de l'utilisateur en base
// 5. Génération du token JWT
// 6. Retour des informations utilisateur (sans mot de passe)
```

**Validations :**
- Email : Format valide
- Mot de passe : Min 8 caractères, 1 majuscule, 1 chiffre

#### 🔐 `POST /api/auth/login`
**Fonctionnalité :** Connexion utilisateur
```javascript
// 1. Vérification de l'existence de l'utilisateur
// 2. Comparaison du mot de passe avec bcrypt
// 3. Génération du token JWT
// 4. Retour des informations utilisateur
```

#### 🚪 `POST /api/auth/logout`
**Fonctionnalité :** Déconnexion
```javascript
// 1. Suppression du cookie contenant le token
// 2. Confirmation de déconnexion
```

#### 🖼️ `POST /api/auth/update-profiel`
**Fonctionnalité :** Mise à jour photo de profil
```javascript
// 1. Vérification de l'authentification (middleware)
// 2. Upload de l'image sur Cloudinary
// 3. Mise à jour du profil utilisateur
// 4. Retour des nouvelles informations
```

**⚠️ ERREUR IDENTIFIÉE :** Faute de frappe
- **Route :** `update-profiel` → `update-profile`

#### ✅ `GET /api/auth/check-auth`
**Fonctionnalité :** Vérification du statut d'authentification
```javascript
// 1. Vérification du token via middleware
// 2. Retour des informations utilisateur
```

## 💬 Gestion des Messages

### Contrôleur des Messages (`message.controller.js`)

#### 👥 `GET /api/message/users`
**Fonctionnalité :** Liste des utilisateurs pour chat
```javascript
// 1. Récupération de tous les utilisateurs sauf l'utilisateur actuel
// 2. Exclusion des mots de passe
// 3. Retour de la liste
```

#### 📨 `GET /api/message/:id`
**Fonctionnalité :** Récupération des messages d'une conversation
```javascript
// 1. Recherche des messages entre l'utilisateur actuel et l'utilisateur ciblé
// 2. Tri par date de création (chronologique)
// 3. Retour des messages
```

#### 📤 `POST /api/message/send/:id`
**Fonctionnalité :** Envoi d'un message
```javascript
// 1. Vérification de l'existence du destinataire
// 2. Validation du contenu (texte ou image requis)
// 3. Upload de l'image sur Cloudinary (si présente)
// 4. Sauvegarde du message en base
// 5. TODO: Notification temps réel via Socket.io
```

## 🖼️ Gestion des Images

### Configuration Cloudinary
- **Profils :** `upload_preset: "profil_pics"`
- **Messages :** `upload_preset: "message_images"`

**⚠️ ATTENTION :** Vous devez configurer ces presets dans votre dashboard Cloudinary.

## 🐛 Erreurs Identifiées et Corrections

### 1. **Base de Données** (`src/lib/db.js`)
```javascript
// ❌ ERREUR
const conn = await mongoose.connect(process.env.MONGOODB_URL);

// ✅ CORRECTION
const conn = await mongoose.connect(process.env.MONGODB_URL);
```

### 2. **Middleware d'Authentification** (`src/middleware/auth.middleware.js`)
```javascript
// ❌ ERREURS
return res.status(401).json({ error: "Not authorized - Token is Invalide" });
console.error("erro in the middleware protectRoute ", error);

// ✅ CORRECTIONS
return res.status(401).json({ error: "Not authorized - Token is Invalid" });
console.error("error in the middleware protectRoute ", error);
```

### 3. **Routes d'Authentification** (`src/routers/auth.route.js`)
```javascript
// ❌ ERREUR
router.post('/update-profiel', protectRoute, updateProfiel);

// ✅ CORRECTION
router.post('/update-profile', protectRoute, updateProfile);
```

### 4. **Modèle Message** (`src/models/message.model.js`)
```javascript
// ❌ PROBLÈME
senderId: {
    type: String,
    required: true,
    ref: 'User'
}

// ✅ CORRECTION
senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
}
```

### 5. **Package.json** - Dépendance inutile
```json
// ❌ ERREUR
"devDependencies": {
    "nodeman": "^1.1.2"  // Devrait être "nodemon"
}

// ✅ CORRECTION
"devDependencies": {
    "nodemon": "^3.0.0"
}
```

## 🚀 Étapes pour Démarrer

### 1. **Correction des erreurs**
```bash
# Corriger les fautes de frappe dans le code
# Mettre à jour les types de données dans les modèles
# Corriger les noms de variables d'environnement
```

### 2. **Configuration de l'environnement**
```bash
# Créer le fichier .env avec les bonnes variables
# Configurer MongoDB (local ou Atlas)
# Configurer Cloudinary avec les upload presets
```

### 3. **Installation et test**
```bash
npm install
npm run dev
# Tester avec un client HTTP (Postman, Insomnia)
```

### 4. **Test des endpoints**
```bash
# Test inscription
POST /api/auth/signup
{
  "email": "test@example.com",
  "fullName": "Test User",
  "password": "TestPass123"
}

# Test connexion
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "TestPass123"
}
```

## 📋 TODO et Améliorations

### 🔥 Priorité Haute
1. **Corriger toutes les erreurs identifiées**
2. **Implémenter Socket.io pour le temps réel**
3. **Ajouter la validation des données d'entrée**
4. **Gérer les erreurs Cloudinary**

### 🔧 Améliorations Techniques
1. **Pagination des messages**
2. **Compression des images**
3. **Rate limiting pour éviter le spam**
4. **Logs structurés**
5. **Tests unitaires**

### 🛡️ Sécurité
1. **Validation plus stricte des uploads**
2. **Limite de taille des fichiers**
3. **Sanitisation des données**
4. **HTTPS en production**

### ✨ Fonctionnalités
1. **Messages vocaux**
2. **Statuts de lecture**
3. **Groupes de discussion**
4. **Recherche dans les messages**
5. **Notifications push**

## 🔧 Scripts NPM

```bash
# Démarrage en développement
npm run dev

# TODO: Ajouter d'autres scripts
npm run start     # Production
npm run test      # Tests
npm run lint      # Linting
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que toutes les variables d'environnement sont configurées
2. Assurez-vous que MongoDB est accessible
3. Vérifiez la configuration Cloudinary
4. Consultez les logs pour identifier les erreurs

---

**Note :** Ce README documente l'état actuel du projet avec ses erreurs. Assurez-vous de corriger les problèmes identifiés avant de passer en production.
