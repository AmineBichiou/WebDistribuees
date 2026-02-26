# User Microservice (Node.js/Express)

Microservice de gestion des utilisateurs avec intégration **Keycloak** et **MongoDB**.

## 🚀 Technologies

- **Node.js** + **Express.js**
- **Keycloak** (Authentification et gestion utilisateurs)
- **MongoDB** (Données métier supplémentaires)
- **Kafka** (Consumer pour les événements de réservation)

---

## 📋 Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- Keycloak (port 8089)
- Kafka (port 9092)

---

## 🛠️ Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer le fichier .env (déjà créé)
# Vérifier les variables d'environnement

# 3. Démarrer MongoDB (si local)
mongod

# 4. Démarrer le service
npm start

# Ou en mode développement avec auto-reload
npm run dev
```

---

## 📍 Endpoints API

### Gestion des utilisateurs (Keycloak)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users` | Liste tous les utilisateurs |
| GET | `/api/users/:id` | Récupérer un utilisateur |
| POST | `/api/users` | Créer un utilisateur |
| PUT | `/api/users/:id` | Modifier un utilisateur |
| DELETE | `/api/users/:id` | Supprimer un utilisateur |

### Profil utilisateur (MongoDB)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/:id/profile` | Récupérer le profil (stats, préférences) |
| PUT | `/api/users/:id/profile` | Modifier le profil |

### Rôles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/:id/roles` | Liste des rôles |
| POST | `/api/users/:id/roles` | Assigner un rôle |

---

## 🧪 Tests avec Postman

### 1. Créer un utilisateur

```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Récupérer tous les utilisateurs

```http
GET http://localhost:3001/api/users
```

### 3. Récupérer un utilisateur avec son profil

```http
GET http://localhost:3001/api/users/{userId}
```

### 4. Mettre à jour le profil

```http
PUT http://localhost:3001/api/users/{userId}/profile
Content-Type: application/json

{
  "preferences": {
    "language": "en",
    "currency": "USD",
    "notifications": {
      "email": true,
      "sms": true
    }
  }
}
```

### 5. Assigner un rôle

```http
POST http://localhost:3001/api/users/{userId}/roles
Content-Type: application/json

{
  "roleName": "admin"
}
```

---

## 🔄 Intégration Kafka

Le service écoute automatiquement le topic `booking-events` et met à jour :
- ✅ Nombre total de réservations
- ✅ Montant total dépensé
- ✅ Points de fidélité (1 point par 10€)
- ✅ Date de dernière réservation

---

## 🏗️ Architecture

```
User Microservice (Node.js)
├── Keycloak (Identité, Auth)
│   └── Utilisateurs, Rôles, Credentials
├── MongoDB (Données métier)
│   └── Préférences, Stats, Points fidélité
└── Kafka Consumer
    └── Écoute les événements de réservation
```

---

## 📊 Modèle de données MongoDB

```javascript
{
  "keycloakUserId": "uuid-from-keycloak",
  "preferences": {
    "language": "fr",
    "currency": "EUR",
    "notifications": {
      "email": true,
      "sms": false
    }
  },
  "statistics": {
    "totalBookings": 5,
    "totalSpent": 1250.00,
    "lastBookingDate": "2026-02-25T10:30:00Z"
  },
  "loyaltyPoints": 125
}
```

---

## 🔗 Intégration avec API Gateway

Ajouter dans `gateway.yml` :

```yaml
- id: user-service
  uri: http://localhost:3001
  predicates:
    - Path=/api/users/**
```

---

## 🐛 Troubleshooting

### Erreur : "Keycloak authentication failed"
- Vérifier que Keycloak est démarré sur http://localhost:8089
- Vérifier les credentials admin dans `.env`

### Erreur : "MongoDB connection error"
- Démarrer MongoDB : `mongod`
- Ou utiliser MongoDB Atlas et mettre à jour `MONGODB_URI`

### Kafka : "Broker may not be available"
- Vérifier que Kafka est démarré : `docker compose ps`
- Le service continue même si Kafka n'est pas disponible

---

## 👥 Développé par

**Équipe de 5 personnes** - Projet Web Distribué

**Port** : 3001
