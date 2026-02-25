# Employee Service

Service de gestion des employés pour le système de microservices Spring Boot.

## Description

Ce microservice gère toutes les opérations liées aux employés, incluant :
- Création, lecture, mise à jour et suppression des employés
- Gestion des statuts des employés
- Recherche et filtrage des employés
- Publication d'événements Kafka pour les changements d'état

## Technologies Utilisées

- **Spring Boot 3.2.1**
- **Spring Data JPA** - Accès aux données
- **H2 Database** - Base de données en mémoire
- **Spring Cloud Config** - Configuration centralisée
- **Spring Cloud Netflix Eureka** - Découverte de services
- **Apache Kafka** - Messagerie asynchrone
- **Lombok** - Réduction du code boilerplate
- **Spring Validation** - Validation des données

## Entité Employee

L'entité Employee contient les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| id | Long | Identifiant unique (auto-généré) |
| employeeNumber | String | Numéro d'employé unique |
| nom | String(50) | Nom de famille |
| prenom | String(50) | Prénom |
| dateNaissance | LocalDate | Date de naissance |
| telephone | String(20) | Numéro de téléphone |
| email | String(100) | Adresse email (unique) |
| adresse | String(150) | Adresse postale |
| poste | String(50) | Poste occupé |
| service | String(50) | Service/département |
| dateEmbauche | LocalDate | Date d'embauche |
| typeContrat | String(20) | Type de contrat |
| statut | EmployeeStatus | Statut de l'employé |
| salaire | BigDecimal(10,2) | Salaire |
| prime | BigDecimal(10,2) | Prime |
| heuresTravailParSemaine | Integer | Heures de travail hebdomadaires |
| typeShift | String(20) | Type de shift |
| createdAt | LocalDateTime | Date de création |
| updatedAt | LocalDateTime | Date de dernière modification |

## Statuts des Employés

- **ACTIF** - Employé actif
- **INACTIF** - Employé inactif
- **EN_CONGE** - En congé
- **SUSPENDU** - Suspendu
- **DEMISSIONNAIRE** - A démissionné

## API Endpoints

### Créer un employé
```http
POST /api/employees
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean",
  "dateNaissance": "1990-05-15",
  "telephone": "+33123456789",
  "email": "jean.dupont@example.com",
  "adresse": "123 Rue de la Paix, Paris",
  "poste": "Développeur Senior",
  "service": "IT",
  "dateEmbauche": "2020-01-15",
  "typeContrat": "CDI",
  "salaire": 45000.00,
  "prime": 5000.00,
  "heuresTravailParSemaine": 35,
  "typeShift": "JOUR"
}
```

### Récupérer tous les employés
```http
GET /api/employees
GET /api/employees?statut=ACTIF
GET /api/employees?service=IT
GET /api/employees?poste=Développeur
GET /api/employees?search=Dupont
```

### Récupérer un employé par ID
```http
GET /api/employees/{id}
```

### Récupérer un employé par numéro
```http
GET /api/employees/number/{employeeNumber}
```

### Récupérer un employé par email
```http
GET /api/employees/email/{email}
```

### Mettre à jour un employé
```http
PUT /api/employees/{id}
Content-Type: application/json

{
  "telephone": "+33987654321",
  "email": "nouveau.email@example.com",
  "adresse": "Nouvelle adresse",
  "poste": "Lead Developer",
  "salaire": 50000.00,
  "prime": 7000.00
}
```

### Changer le statut d'un employé
```http
PATCH /api/employees/{id}/status?statut=EN_CONGE
```

### Supprimer un employé (désactivation)
```http
DELETE /api/employees/{id}
```

### Health Check
```http
GET /api/employees/health
```

## Configuration

### application.yml
```yaml
spring:
  application:
    name: EMPLOYEE
  config:
    import: "optional:configserver:http://localhost:8888"
  
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

kafka:
  topic:
    employee-events: employee-events
```

## Événements Kafka

Le service publie des événements Kafka pour les actions suivantes :
- **CREATED** - Nouvel employé créé
- **UPDATED** - Employé mis à jour
- **STATUS_CHANGED** - Statut de l'employé changé

### Structure de l'événement
```json
{
  "employeeId": 1,
  "employeeNumber": "EMP-12345678",
  "eventType": "CREATED",
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "poste": "Développeur Senior",
  "service": "IT",
  "statut": "ACTIF",
  "eventTime": "2024-01-15T10:30:00"
}
```

## Démarrage

### Prérequis
- Java 17+
- Maven 3.6+
- Docker (pour Kafka)

### Lancer le service
```bash
# Compiler
mvn clean install

# Lancer
mvn spring-boot:run
```

### Avec Docker Compose
```bash
docker-compose up -d
```

## Validation des Données

Le service implémente une validation stricte :
- Email unique et format valide
- Âge minimum de 18 ans
- Téléphone au format valide
- Salaire supérieur à 0
- Heures de travail entre 1 et 70 par semaine

## Gestion des Erreurs

Le service gère les erreurs suivantes :
- **404 NOT_FOUND** - Employé non trouvé
- **400 BAD_REQUEST** - Données invalides
- **500 INTERNAL_SERVER_ERROR** - Erreur serveur

## Auteur

Créé dans le cadre du projet Spring Microservice Starter Kit
