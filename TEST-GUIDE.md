# 🧪 Guide de Test Complet - Architecture Microservices

## 📋 Prérequis

### Services à démarrer (dans l'ordre) :

1. **Docker Desktop** : Doit être démarré et prêt ✅

2. **Keycloak** (port 8089) :
   ```bash
   cd user_microservice
   docker-compose -f docker-compose-keycloak.yml up -d
   ```

3. **Kafka + Zookeeper** (ports 9092, 9090) :
   ```bash
   cd booking_service
   docker-compose up -d
   ```

4. **Booking Service** (port 8082) :
   ```bash
   cd booking_service
   mvn spring-boot:run
   ```

5. **User Microservice** (port 3001) :
   ```bash
   cd user_microservice
   npm start
   ```

---

## 🎯 Scénario de Test : Signin → Create Booking avec JWT

### Étape 1 : 🔐 Authentification - Obtenir le Token JWT

**URL** : `POST http://localhost:8089/realms/microservices-realm/protocol/openid-connect/token`

**Headers** :
```
Content-Type: application/x-www-form-urlencoded
```

**Body (x-www-form-urlencoded)** :
```
grant_type: password
client_id: booking-app
username: testuser
password: password123
```

**Réponse attendue** :
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "token_type": "Bearer",
  "session_state": "...",
  "scope": "profile email"
}
```

✅ **Copiez le `access_token`** pour les étapes suivantes !

---

### Étape 2 : 📝 Créer une Réservation avec le Token

**URL** : `POST http://localhost:8082/api/bookings`

**Headers** :
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
Content-Type: application/json
```

**Body (JSON)** :
```json
{
  "roomId": 101,
  "hotelId": 1,
  "checkInDate": "2026-03-15",
  "checkOutDate": "2026-03-20",
  "numberOfGuests": 2,
  "pricePerNight": 100.00,
  "specialRequests": "Vue sur mer si possible"
}
```

**⚠️ Important** : 
- Le champ `userId` n'est **plus requis** dans le body
- Il est **automatiquement extrait** du JWT token
- Le Booking Service lit le token et récupère l'utilisateur

**Réponse attendue** :
```json
{
  "id": 1,
  "confirmationNumber": "BK-XXXX",
  "roomId": 101,
  "hotelId": 1,
  "userId": "e4d3c2b1-a0b9-4c8d-9e0f-1234567890ab",
  "checkInDate": "2026-03-15",
  "checkOutDate": "2026-03-20",
  "numberOfGuests": 2,
  "totalPrice": 500.00,
  "status": "PENDING",
  "createdAt": "2026-02-26T03:15:30.123Z"
}
```

**🎉 Succès** : Un événement Kafka est publié automatiquement !

---

### Étape 3 : 📊 Vérifier les Stats Utilisateur (Kafka Consumer)

**URL** : `GET http://localhost:3001/api/users/profile`

**Headers** :
```
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

**Réponse attendue** :
```json
{
  "keycloakUserId": "e4d3c2b1-a0b9-4c8d-9e0f-1234567890ab",
  "username": "testuser",
  "email": "test@example.com",
  "totalBookings": 1,
  "totalSpent": 500.00,
  "loyaltyPoints": 50,
  "statistics": {
    "lastBookingDate": "2026-02-26T03:15:30.123Z",
    "averageBookingValue": 500.00
  },
  "createdAt": "2026-02-26T03:00:00.000Z"
}
```

**✅ Vérifications** :
- `totalBookings`: Incrémenté de 1
- `totalSpent`: Prix total de la réservation
- `loyaltyPoints`: 1 point par 10€ dépensés (500€ = 50 points)

---

## 🔍 Tests Additionnels

### Test 4 : Récupérer toutes les réservations de l'utilisateur

```
GET http://localhost:8082/api/bookings/user/{keycloakUserId}
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

### Test 5 : Annuler une réservation (déclenche événement CANCELLED)

```
PATCH http://localhost:8082/api/bookings/1/cancel
Authorization: Bearer VOTRE_ACCESS_TOKEN
```

Cela déclenche un événement Kafka `CANCELLED` qui met à jour les stats.

### Test 6 : Vérifier Kafka UI

**URL** : http://localhost:9090

- Allez dans "Topics" → "booking-events"
- Vérifiez les messages publiés avec les événements CREATED, UPDATED, CANCELLED

---

## 🐛 Dépannage

### Erreur : "401 Unauthorized"
- ✅ Vérifiez que le token n'a pas expiré (valide 5 minutes)
- ✅ Vérifiez le format : `Authorization: Bearer TOKEN` (pas de Bearer)

### Erreur : "Unable to find valid certification path"
- ✅ Keycloak n'est pas démarré
- ✅ Vérifiez : `docker ps` → keycloak doit être UP

### Erreur : "Failed to connect to Kafka"
- ✅ Kafka n'est pas démarré
- ✅ Lancez : `cd booking_service && docker-compose up -d`

### Docker : "unable to get image"
- ✅ Docker Desktop n'est pas démarré
- ✅ Ouvrez Docker Desktop et attendez qu'il soit prêt

---

## 📦 Collection Postman

Importez les collections :
1. `user_microservice/Keycloak-Auth.postman_collection.json`
2. `booking_service/Booking-Service-JWT.postman_collection.json` (à créer)

Les variables d'environnement :
```
keycloak_url: http://localhost:8089
booking_url: http://localhost:8082
user_url: http://localhost:3001
access_token: (sera rempli automatiquement après login)
```

---

## ✅ Checklist de Test

- [ ] Keycloak démarré et accessible (http://localhost:8089/admin)
- [ ] Kafka + Zookeeper démarrés (docker-compose up)
- [ ] Booking Service démarré (port 8082)
- [ ] User Microservice démarré (port 3001)
- [ ] Login réussi et token obtenu
- [ ] Création de booking avec token réussie
- [ ] userId automatiquement extrait du JWT
- [ ] Événement Kafka publié
- [ ] Stats utilisateur mises à jour (totalBookings, loyaltyPoints)
- [ ] Messages visibles dans Kafka UI

**🎉 Si tous ces points sont validés, votre architecture microservices fonctionne parfaitement !**
