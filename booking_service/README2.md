Kafka 3.6.0 Setup & Run Guide (Docker)
Requirements
Docker installed → docker --version to check
Step 2 — Created docker-compose.yml
services:

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    depends_on:
      - kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
      KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181
COMPOSE
Step 3 — Start Everything
docker compose up -d
Step 4 — Verify
docker compose ps
All 3 should show Up:

NAME        STATUS
zookeeper   Up
kafka       Up
kafka-ui    Up
Step 5 — Open Kafka UI
Open your browser and go to:

http://localhost:9090

---

## 🧪 Comment Tester avec l'Architecture Complète (Eureka + Gateway + Kafka)

> **📮 Outil de test** : Postman (tous les exemples ci-dessous)  
> **📦 Collection prête** : `Booking-Service.postman_collection.json` (voir section Import ci-dessous)

### Architecture des services

| Service | Port | Description |
|---------|------|-------------|
| Config Server | 8888 | Configuration centralisée |
| Eureka Server | 8761 | Service Discovery |
| API Gateway | 8090 | Point d'entrée unique |
| Booking Service | 8082 | Microservice de réservations |
| Kafka | 9092 | Message Broker |
| Kafka UI | 9090 | Interface graphique Kafka |

---

### 📥 Option 1 : Importer la Collection Postman (Recommandé - Rapide!)

Un fichier collection Postman prêt à l'emploi : **`Booking-Service.postman_collection.json`**

**Dans Postman** :
1. Cliquer sur **Import** (en haut à gauche)
2. Sélectionner le fichier **`Booking-Service.postman_collection.json`**
3. Cliquer sur **Import**
4. ✅ Tous les 11 endpoints sont prêts à tester!

**Vous pouvez alors passer directement au Test 1 ci-dessous** 👇

---

### 📝 Option 2 : Créer manuellement les requêtes

Si vous préférez créer les requêtes manuellement, suivez les tests ci-dessous :

---

### Test 1 : Démarrer Kafka

```powershell
# Dans le dossier booking_service
cd booking_service
docker compose up -d

# Vérifier que tous les conteneurs sont Up
docker compose ps
```

### Test 2 : Démarrer les microservices dans l'ordre

**Ouvrez 4 terminaux PowerShell séparés :**

#### Terminal 1 : Config Server
```powershell
cd config-server
mvn spring-boot:run
```
Attendre le message : `Started ConfigServerApplication`

#### Terminal 2 : Eureka Server
```powershell
cd eureka-server
mvn spring-boot:run
```
Attendre le message : `Started EurekaServerApplication`  
Vérifier : http://localhost:8761

#### Terminal 3 : API Gateway
```powershell
cd api-gateway
mvn spring-boot:run
```
Attendre le message : `Started GatewayApplication`

#### Terminal 4 : Booking Service
```powershell
cd booking_service
mvn spring-boot:run
```
Attendre le message : `Started BookingServiceApplication`

### Test 3 : Vérifier l'enregistrement dans Eureka

1. Ouvrir **http://localhost:8761** (Eureka Dashboard)
2. Vérifier que **BOOKING** et **GATEWAY** sont enregistrés

### Test 4 : Créer une réservation via l'API Gateway (Postman)

**⚠️ Important : Utiliser le port 8090 (Gateway) au lieu de 8082 (Service direct)**

**Dans Postman :**

1. **Méthode** : `POST`
2. **URL** : `http://localhost:8090/api/bookings`
3. **Headers** :
   - `Content-Type` : `application/json`
4. **Body** → **raw** → **JSON** :
```json
{
  "roomId": 101,
  "hotelId": 1,
  "userId": "user-123",
  "checkInDate": "2026-03-15",
  "checkOutDate": "2026-03-20",
  "numberOfGuests": 2,
  "pricePerNight": 150.00,
  "specialRequests": "Vue sur mer"
}
```
5. **Cliquer sur** : `Send`

**Résultat attendu** : 
- **Status** : `201 Created`
- **Response Body exemple** :
```json
{
  "id": 1,
  "confirmationNumber": "BK-A1B2C3D4",
  "roomId": 101,
  "hotelId": 1,
  "userId": "user-123",
  "checkInDate": "2026-03-15",
  "checkOutDate": "2026-03-20",
  "numberOfGuests": 2,
  "numberOfNights": 5,
  "pricePerNight": 150.00,
  "totalPrice": 750.00,
  "status": "CONFIRMED",
  "specialRequests": "Vue sur mer",
  "createdAt": "2026-02-25T14:30:00",
  "updatedAt": "2026-02-25T14:30:00"
}
```
- ✅ La requête passe par : **Gateway (8090)** → **Eureka** → **Booking Service (8082)**
- ✅ Un événement `CREATED` est publié sur Kafka topic `booking-events`

### Test 5 : Récupérer toutes les réservations via Gateway (Postman)

**Dans Postman :**

1. **Méthode** : `GET`
2. **URL** : `http://localhost:8090/api/bookings`
3. **Cliquer sur** : `Send`

**Résultat** : Liste de toutes les réservations en JSON

### Test 6 : Modifier une réservation (événement UPDATED)

**Dans Postman :**

1. **Méthode** : `PUT`
2. **URL** : `http://localhost:8090/api/bookings/1`
3. **Headers** :
   - `Content-Type` : `application/json`
4. **Body** → **raw** → **JSON** :
```json
{
  "checkInDate": "2026-03-16",
  "checkOutDate": "2026-03-21",
  "numberOfGuests": 3
}
```

**Résultat** : **Status** `200 OK` + événement `UPDATED` publié sur Kafka

### Test 7 : Annuler une réservation (événement CANCELLED)

**Dans Postman :**

1. **Méthode** : `PATCH`
2. **URL** : `http://localhost:8090/api/bookings/1/cancel`
3. **Cliquer sur** : `Send`

**Résultat** : **Status** `200 OK` + `status: "CANCELLED"` + événement `CANCELLED` publié sur Kafka

### Test 8 : Visualiser les événements dans Kafka UI

1. Ouvrir **http://localhost:9090** dans votre navigateur
2. Cliquer sur le cluster **"local"**
3. Aller dans **Topics** → **booking-events**
4. Cliquer sur **Messages** pour voir tous les événements

Vous devriez voir les messages JSON avec :
```json
{
  "bookingId": 1,
  "confirmationNumber": "BK-ABC12345",
  "eventType": "CREATED",
  "roomId": 101,
  "hotelId": 1,
  "userId": "user-123",
  "checkInDate": "2026-03-15",
  "checkOutDate": "2026-03-20",
  "numberOfGuests": 2,
  "totalPrice": 750.00,
  "status": "CONFIRMED",
  "eventTime": "2026-02-25T14:30:00"
}
```

### Test 9 : Vérifier les logs du service

Dans les logs du Booking Service, vous devriez voir :

```
INFO - Sending booking event: CREATED for booking ID: 1
INFO - Booking event sent successfully to topic: booking-events
```

### Test 10 : Accès direct (sans Gateway) - Pour debug uniquement

Si besoin de tester directement le service (bypass Gateway) :

**Dans Postman :**

1. **GET** `http://localhost:8082/api/bookings` (accès direct)
2. **Console H2** : `http://localhost:8082/h2-console` (dans le navigateur)

**⚠️ En production, toujours passer par le Gateway (port 8090)**

---

## 📦 Collection Postman - Endpoints disponibles

### Via Gateway (Port 8090) ✅ Recommandé

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `http://localhost:8090/api/bookings` | Créer une réservation |
| GET | `http://localhost:8090/api/bookings` | Liste toutes les réservations |
| GET | `http://localhost:8090/api/bookings/1` | Récupérer par ID |
| GET | `http://localhost:8090/api/bookings/confirmation/BK-ABC123` | Récupérer par confirmation |
| GET | `http://localhost:8090/api/bookings/user/user-123` | Réservations d'un user |
| GET | `http://localhost:8090/api/bookings/hotel/1` | Réservations d'un hôtel |
| GET | `http://localhost:8090/api/bookings?status=CONFIRMED` | Filtrer par statut |
| PUT | `http://localhost:8090/api/bookings/1` | Modifier une réservation |
| PATCH | `http://localhost:8090/api/bookings/1/cancel` | Annuler une réservation |
| DELETE | `http://localhost:8090/api/bookings/1` | Supprimer une réservation |

---

## 📊 Types d'événements publiés

| Action | Event Type | Trigger |
|--------|------------|---------|
| Créer réservation | `CREATED` | POST /api/bookings |
| Modifier réservation | `UPDATED` | PUT /api/bookings/{id} |
| Annuler réservation | `CANCELLED` | PATCH /api/bookings/{id}/cancel |

---

## 🛑 Arrêter tout

```powershell
# Dans chaque terminal, arrêter les services avec Ctrl + C dans l'ordre inverse :
# 1. Booking Service (Ctrl + C)
# 2. API Gateway (Ctrl + C)
# 3. Eureka Server (Ctrl + C)
# 4. Config Server (Ctrl + C)

# Arrêter Kafka
cd booking_service
docker compose down
```

---

## 🎯 Résumé du Flow de Test

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ http://localhost:8090/api/bookings
       ▼
┌─────────────┐
│ API Gateway │ (Port 8090)
└──────┬──────┘
       │ Service Discovery via Eureka
       ▼
┌─────────────┐
│   Eureka    │ (Port 8761)
└──────┬──────┘
       │ Route vers BOOKING
       ▼
┌─────────────────┐       ┌─────────────┐
│ Booking Service │──────▶│    Kafka    │ (Port 9092)
└─────────────────┘       └─────────────┘
   (Port 8082)                   │
                                 ▼
                          ┌─────────────┐
                          │  Kafka UI   │ (Port 9090)
                          └─────────────┘
```

**Tous les services communiquent ensemble pour une architecture microservices complète! 🚀**

---

## 💡 Tips Postman

### Variables d'environnement (optionnel)
Créer un environnement Postman avec :
- `gateway_url` = `http://localhost:8090`
- `booking_id` = `1` (à mettre à jour après création)
- `confirmation_number` = `BK-ABC123` (à copier de la réponse)

Ensuite utiliser : `{{gateway_url}}/api/bookings/{{booking_id}}`

### Sauvegarder les tests
Après chaque requête réussie :
1. Cliquer sur **Save Response** → **Save as Example**
2. Cela vous permet de comparer les futures réponses

### Tests automatisés (avancé)
Dans l'onglet **Tests** d'une requête, ajouter :
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Has confirmation number", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.confirmationNumber).to.exist;
});
```