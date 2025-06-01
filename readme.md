# Chat App API

Une API de chat en temps réel moderne construite avec Node.js, Express, MongoDB et Socket.io pour la messagerie instantanée.

## 🚀 Fonctionnalités

### Authentification & Gestion des utilisateurs
- **Inscription** et **connexion** sécurisées
- **Authentification JWT** avec cookies sécurisés
- **Gestion des profils** (nom complet, photo de profil)
- **Middleware de protection** des routes

### Messagerie
- **Messages en temps réel** (texte et images)
- **Historique des conversations**
- **Upload d'images** via Cloudinary
- **Interface de chat intuitive**

## 📁 Structure du projet

```
CHAT-APP-API/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js      # Gestion authentification
│   │   └── message.controller.js   # Gestion des messages
│   ├── lib/
│   │   ├── cloudinary.js          # Configuration Cloudinary
│   │   ├── db.js                  # Connexion MongoDB
│   │   └── util.js                # Utilitaires
│   ├── middleware/
│   │   └── auth.middleware.js     # Middleware d'authentification
│   ├── models/
│   │   ├── message.model.js       # Modèle Message
│   │   └── user.model.js          # Modèle Utilisateur
│   ├── routes/
│   │   ├── auth.route.js          # Routes authentification
│   │   └── message.route.js       # Routes messages
│   └── index.js                   # Point d'entrée
├── .gitignore
├── package.json
└── package-lock.json
```

## 🛠️ Installation

### Prérequis
- Node.js (v16 ou supérieur)
- MongoDB
- Compte Cloudinary (pour l'upload d'images)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/chat-app-api.git
cd chat-app-api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
# Configuration serveur
PORT=5000
NODE_ENV=development

# Base de données
MONGODB_URI=mongodb://localhost:27017/chat-app
# ou pour MongoDB Atlas :
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# JWT
JWT_SECRET=votre_cle_secrete_tres_longue_et_securisee

# Cloudinary (pour l'upload d'images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

4. **Lancer l'application**

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

L'API sera accessible sur `http://localhost:5000`

## 📚 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| `POST` | `/signup` | Créer un compte | ❌ |
| `POST` | `/login` | Se connecter | ❌ |
| `POST` | `/logout` | Se déconnecter | ✅ |
| `PUT` | `/update-profile` | Mettre à jour le profil | ✅ |
| `GET` | `/check` | Vérifier l'authentification | ✅ |

### Messages (`/api/messages`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| `GET` | `/users` | Liste des utilisateurs | ✅ |
| `GET` | `/:id` | Historique avec un utilisateur | ✅ |
| `POST` | `/send/:id` | Envoyer un message | ✅ |

## 💻 Exemples d'utilisation

### Inscription
```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

### Connexion
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

### Envoyer un message
```javascript
POST /api/messages/send/USER_ID
Content-Type: application/json
Cookie: jwt=TOKEN

{
  "text": "Salut ! Comment ça va ?",
  "image": "data:image/jpeg;base64,..." // optionnel
}
```

## 🔧 Technologies utilisées

- **Backend :** Node.js, Express.js
- **Base de données :** MongoDB avec Mongoose
- **Authentification :** JWT (JSON Web Tokens)
- **Upload d'images :** Cloudinary
- **Sécurité :** bcryptjs, cookie-parser
- **Validation :** Validation côté serveur

## 🚦 Scripts disponibles

```bash
# Démarrer en mode développement
npm run dev

# Démarrer en mode production
npm start

# Lancer les tests (à configurer)
npm test
```

## 🔒 Sécurité

- **Hashage des mots de passe** avec bcryptjs
- **Tokens JWT** stockés dans des cookies sécurisés
- **Validation des données** côté serveur
- **Middleware d'authentification** pour protéger les routes sensibles
- **Variables d'environnement** pour les informations sensibles

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

## 📝 TODO / Améliorations futures

- [ ] Notifications en temps réel avec Socket.io
- [ ] Messages de groupe
- [ ] Statut en ligne/hors ligne
- [ ] Indicateurs de lecture des messages
- [ ] Recherche dans l'historique
- [ ] Emoji et réactions
- [ ] API de modération
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API avec Swagger


---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a été utile !**