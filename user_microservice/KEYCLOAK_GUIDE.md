# 🔐 Guide Keycloak - Authentification et Tokens

## 🎯 Deux approches pour tester

### ✅ Option 1 : Interface Keycloak (Admin) - Gérer les utilisateurs
### ✅ Option 2 : API REST (Postman) - Login et obtenir un token

---

## 📋 Option 1 : Interface Keycloak (Recommandé pour débuter)

### 1️⃣ Accéder à Keycloak Admin

```
URL: http://localhost:8089/admin
Username: admin
Password: admin
```

### 2️⃣ Sélectionner le Realm

1. En haut à gauche, cliquer sur **"master"**
2. Sélectionner **"microservices-realm"**
   - ⚠️ Si le realm n'existe pas, le créer :
     - Cliquer sur **Create Realm**
     - Name: `microservices-realm`
     - **Save**

### 3️⃣ Créer un utilisateur via l'interface

1. Menu de gauche → **Users**
2. Cliquer sur **Add User**
3. Remplir :
   ```
   Username: john.doe
   Email: john@example.com
   First name: John
   Last name: Doe
   Email verified: ON
   Enabled: ON
   ```
4. **Create**

### 4️⃣ Définir le mot de passe

1. Aller dans l'onglet **Credentials**
2. Cliquer sur **Set password**
3. Entrer :
   ```
   Password: Password123!
   Password confirmation: Password123!
   Temporary: OFF (important!)
   ```
4. **Save**

### 5️⃣ Assigner un rôle (optionnel)

1. Onglet **Role mapping**
2. **Assign role**
3. Sélectionner `admin` ou `user`
4. **Assign**

✅ **Utilisateur créé!** Vous pouvez maintenant l'utiliser pour vous connecter.

---

## 🚀 Option 2 : API REST - Login et Token (Via Postman)

### 📦 Prérequis : Créer un Client dans Keycloak

**Une seule fois** :

1. Dans Keycloak Admin → **Clients**
2. **Create client**
3. Configuration :
   ```
   Client ID: booking-app
   Client Protocol: openid-connect
   ```
4. **Next**
5. Configuration suite :
   ```
   Client authentication: OFF (public client)
   Authorization: OFF
   Authentication flow:
     ✅ Standard flow
     ✅ Direct access grants
   ```
6. **Save**
7. Aller dans l'onglet **Settings** du client `booking-app`
8. Ajouter les **Valid redirect URIs** :
   ```
   http://localhost:3000/*
   http://localhost:8090/*
   ```
9. **Save**

---

## 🔑 Obtenir un Token via Postman

### Étape 1 : Créer un utilisateur (si pas fait)

**Via votre User Microservice** :

```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "username": "test.user",
  "email": "test@example.com",
  "password": "Password123!",
  "firstName": "Test",
  "lastName": "User"
}
```

### Étape 2 : Login et obtenir le token

**POST Request dans Postman** :

```
URL: http://localhost:8089/realms/microservices-realm/protocol/openid-connect/token
Method: POST
Headers:
  Content-Type: application/x-www-form-urlencoded
Body (x-www-form-urlencoded):
  grant_type: password
  client_id: booking-app
  username: test.user
  password: Password123!
```

**Réponse** :
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6...",
  "token_type": "Bearer"
}
```

✅ **Copier le `access_token`** - c'est votre JWT!

---

## 🎯 Utiliser le Token dans d'autres Microservices

### Via Postman

**Ajouter le token dans vos requêtes** :

**Méthode 1 : Header Authorization**

```
Headers:
  Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldU...
```

**Exemple concret** :

```http
GET http://localhost:8090/api/bookings
Headers:
  Authorization: Bearer <votre_token_ici>
```

**Méthode 2 : Postman Collection (Automatique)**

1. Dans Postman, ouvrir votre collection
2. Aller dans **Collection → Authorization**
3. Type: **OAuth 2.0**
4. Configuration :
   ```
   Grant Type: Password Credentials
   Access Token URL: http://localhost:8089/realms/microservices-realm/protocol/openid-connect/token
   Client ID: booking-app
   Username: test.user
   Password: Password123!
   ```
5. **Get New Access Token**
6. **Use Token**

Maintenant toutes vos requêtes auront automatiquement le token! 🎉

---

## 🔄 Workflow Complet

```
┌──────────────────────────────────────────┐
│  1. Créer utilisateur                    │
│     - Via Interface Keycloak (Admin)     │
│     - OU via API /api/users              │
└─────────────┬────────────────────────────┘
              ▼
┌──────────────────────────────────────────┐
│  2. Login (obtenir token)                │
│     POST /protocol/openid-connect/token  │
│     → Récupérer access_token             │
└─────────────┬────────────────────────────┘
              ▼
┌──────────────────────────────────────────┐
│  3. Utiliser le token                    │
│     Header: Authorization: Bearer <token>│
│                                           │
│     GET  /api/bookings     ←─── Avec token
│     POST /api/bookings     ←─── Avec token
│     GET  /api/users/profile ←─── Avec token
└──────────────────────────────────────────┘
              ▼
┌──────────────────────────────────────────┐
│  4. API Gateway vérifie le token         │
│     - Extrait userId du token            │
│     - Vérifie les permissions            │
│     - Route vers le microservice         │
└──────────────────────────────────────────┘
```

---

## 🧪 Tests Complets

### Test 1 : Créer un user via API

```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@example.com",
  "password": "Password123!",
  "firstName": "Alice",
  "lastName": "Wonder"
}
```

**Résultat** : User créé dans Keycloak + profil dans MongoDB (si disponible)

### Test 2 : Login

```http
POST http://localhost:8089/realms/microservices-realm/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password&client_id=booking-app&username=alice&password=Password123!
```

**Résultat** : Vous obtenez un `access_token`

### Test 3 : Utiliser le token

```http
GET http://localhost:8090/api/users
Headers:
  Authorization: Bearer <votre_token>
```

**Résultat** : Liste des utilisateurs (si vous avez le rôle nécessaire)

### Test 4 : Créer une réservation avec le token

```http
POST http://localhost:8090/api/bookings
Headers:
  Authorization: Bearer <votre_token>
  Content-Type: application/json
Body:
{
  "roomId": 101,
  "hotelId": 1,
  "userId": "alice@example.com",
  "checkInDate": "2026-03-15",
  "checkOutDate": "2026-03-20",
  "numberOfGuests": 2,
  "pricePerNight": 150.00
}
```

---

## 🛡️ Sécurité - Comment ça fonctionne

### Le Token JWT contient :

```json
{
  "sub": "user-uuid-from-keycloak",
  "email": "alice@example.com",
  "name": "Alice Wonder",
  "preferred_username": "alice",
  "realm_access": {
    "roles": ["user", "admin"]
  },
  "exp": 1709151234,
  "iat": 1709150934
}
```

### API Gateway décode le token :

1. ✅ Vérifie la signature (cryptographiquement)
2. ✅ Vérifie l'expiration (`exp`)
3. ✅ Extrait l'utilisateur (`sub`)
4. ✅ Vérifie les rôles (`realm_access.roles`)
5. ✅ Autorise ou refuse l'accès

---

## 💡 Conseils

### Pour le développement :

1. ✅ **Désactiver temporairement la sécurité** dans le Gateway (comme vous l'avez fait)
   - Permet de tester sans token
   - Plus rapide pour développer

2. ✅ **Activer la sécurité** pour les tests finaux
   - Dé-commenter OAuth2 dans `SecurityConfig.java`
   - Tester avec de vrais tokens

### Pour la production :

1. ✅ **Toujours activer OAuth2**
2. ✅ **Utiliser HTTPS**
3. ✅ **Tokens courts** (5-15 minutes)
4. ✅ **Refresh tokens** pour renouveler

---

## 🎓 Résumé pour votre équipe

| Méthode | Quand l'utiliser | Avantages |
|---------|------------------|-----------|
| **Interface Keycloak** | Admin, création initiale | Visuel, facile |
| **API REST (/api/users)** | Signup depuis le frontend | Automatisé |
| **Login API + Token** | Production, vrais users | Sécurisé, standard OAuth2 |

---

## ✅ Checklist avant de tester

- [ ] Keycloak démarré (http://localhost:8089)
- [ ] Realm `microservices-realm` créé
- [ ] Client `booking-app` configuré
- [ ] Au moins 1 utilisateur créé
- [ ] User Microservice démarré (port 3001)
- [ ] API Gateway démarré (port 8090)

**🎉 Vous êtes prêt!**
