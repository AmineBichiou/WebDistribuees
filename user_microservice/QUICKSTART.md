# 🚀 Quick Start - User Microservice

## Démarrage en 5 minutes

### 1️⃣ Installer les dépendances

```powershell
cd user_microservice
npm install
```

### 2️⃣ Configurer Keycloak

**a) Vérifier que Keycloak est démarré** :
- URL: http://localhost:8089
- Realm: `microservices-realm`
- Credentials admin: `admin / admin`

**b) Créer le realm dans Keycloak** (si pas encore fait) :
1. Ouvrir http://localhost:8089/admin
2. Login avec `admin / admin`
3. Créer un nouveau realm : `microservices-realm`
4. Créer un client : `admin-cli` (Type: Public)

### 3️⃣ Démarrer MongoDB

**Option A : MongoDB local**
```powershell
mongod
```

**Option B : MongoDB Atlas**
- Créer un cluster gratuit sur https://www.mongodb.com/cloud/atlas
- Copier l'URI de connexion dans `.env` → `MONGODB_URI`

### 4️⃣ Démarrer Kafka (si pas déjà fait)

```powershell
cd ..\booking_service
docker compose up -d
```

### 5️⃣ Démarrer le User Microservice

```powershell
cd ..\user_microservice
npm start
```

Vous devriez voir :
```
╔═══════════════════════════════════════════╗
║   User Microservice (Node.js) Started    ║
╠═══════════════════════════════════════════╣
║  Port:        3001                        ║
║  Keycloak:    http://localhost:8089       ║
║  MongoDB:     Connected                   ║
║  Kafka:       Listening...                ║
╚═══════════════════════════════════════════╝
```

---

## 🧪 Tester avec Postman

### Option 1 : Importer la collection (Recommandé)
1. Ouvrir Postman
2. **Import** → Sélectionner `User-Service.postman_collection.json`
3. Tous les endpoints sont prêts!

### Option 2 : Test manuel

**1. Health Check**
```
GET http://localhost:3001/health
```

**2. Créer un utilisateur**
```
POST http://localhost:3001/api/users
Body (JSON):
{
  "username": "test.user",
  "email": "test@example.com",
  "password": "Password123!",
  "firstName": "Test",
  "lastName": "User"
}
```

**3. Récupérer tous les utilisateurs**
```
GET http://localhost:3001/api/users
```

**4. Copier l'ID d'un utilisateur et tester**
```
GET http://localhost:3001/api/users/{userId}
GET http://localhost:3001/api/users/{userId}/profile
```

---

## 🔄 Tester l'intégration Kafka

### 1. Créer une réservation (dans Booking Service)

```
POST http://localhost:8090/api/bookings
Body:
{
  "roomId": 101,
  "hotelId": 1,
  "userId": "{userId}",  ← Mettre l'ID Keycloak de votre user
  "checkInDate": "2026-03-15",
  "checkOutDate": "2026-03-20",
  "numberOfGuests": 2,
  "pricePerNight": 150.00
}
```

### 2. Vérifier dans les logs du User Service

Vous devriez voir :
```
📨 Received booking event: { eventType: 'CREATED', userId: '...' }
✅ Booking CREATED for user ...
📊 User statistics updated: { totalBookings: 1, loyaltyPoints: 75 }
```

### 3. Vérifier le profil utilisateur

```
GET http://localhost:3001/api/users/{userId}/profile
```

Réponse :
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalBookings": 1,
      "totalSpent": 750.00,
      "lastBookingDate": "2026-02-25T..."
    },
    "loyaltyPoints": 75
  }
}
```

---

## 🎯 Tester via API Gateway (port 8090)

**Important** : Redémarrer le Config Server et Gateway après modification du `gateway.yml`

```powershell
# Terminal Config Server
cd config-server
# Ctrl+C puis relancer
mvn spring-boot:run

# Terminal API Gateway  
cd api-gateway
# Ctrl+C puis relancer
mvn spring-boot:run
```

Ensuite tester :
```
GET http://localhost:8090/api/users
POST http://localhost:8090/api/users
```

---

## 🐛 Troubleshooting

### ❌ Erreur : "Keycloak authentication failed"
**Solution** :
1. Vérifier que Keycloak est démarré : http://localhost:8089
2. Vérifier le realm : `microservices-realm`
3. Vérifier les credentials dans `.env`

### ❌ Erreur : "MongoDB connection error"
**Solution** :
- Option 1 : Démarrer MongoDB local : `mongod`
- Option 2 : Le service continue sans MongoDB (fonctionnalités Keycloak OK)

### ❌ Erreur : "Cannot find module"
**Solution** :
```powershell
rm -rf node_modules
npm install
```

### ⚠️ Warning : "Kafka Consumer error"
**C'est normal si** :
- Kafka n'est pas démarré
- Le service continue à fonctionner (juste pas d'écoute Kafka)

---

## 📊 Fonctionnalités

### ✅ Keycloak (Identité)
- Créer/Lire/Modifier/Supprimer utilisateurs
- Gérer les rôles
- Authentification centralisée

### ✅ MongoDB (Métier)
- Préférences utilisateur (langue, devise, notifications)
- Statistiques (réservations, montant dépensé)
- Points de fidélité

### ✅ Kafka (Événements)
- Écoute les événements `booking-events`
- Met à jour automatiquement les stats
- Calcul des points de fidélité (1 pt par 10€)

---

## 🎓 Pour votre équipe

**Répartir le travail** :
1. Setup Keycloak + tests endpoints users (1 personne)
2. MongoDB + modèle UserProfile (1 personne)
3. Kafka Consumer + logique stats (1 personne)
4. Intégration Gateway + tests end-to-end (1 personne)
5. Documentation + Collection Postman (1 personne)

---

**Bon courage! 🚀**
