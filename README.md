# Microservices Architecture - Setup Guide

## Overview

This project consists of a microservices architecture with Spring Cloud components including Config Server, Eureka Server, API Gateway, and User Service.

## Services and Ports

| Service           | Port | URL                                            |
| ----------------- | ---- | ---------------------------------------------- |
| **Config Server** | 8888 | [http://localhost:8888](http://localhost:8888) |
| **Eureka Server** | 8761 | [http://localhost:8761](http://localhost:8761) |
| **API Gateway**   | 8090 | [http://localhost:8090](http://localhost:8090) |
| **User Service**  | 8081 | [http://localhost:8081](http://localhost:8081) |

## Startup Order

**IMPORTANT:** Start services in this exact order:

1. **Config Server** (Port 8888)

   * Start first as other services depend on it for configuration
2. **Eureka Server** (Port 8761)

   * Service discovery registry
3. **User Service** (Port 8081)

   * Business service with MongoDB
4. **API Gateway** (Port 8090)

   * Start last to ensure all services are registered

---

## Running Keycloak (Docker)

This project requires a Keycloak server for authentication. You can run Keycloak locally using Docker with the following command:

```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:24.0.3 start-dev
```

* This runs Keycloak in development mode
* Admin username: `admin`
* Admin password: `admin`
* Accessible at: `http://localhost:8080`

---

<img width="1053" height="720" alt="Screenshot from 2026-02-07 10-47-23" src="https://github.com/user-attachments/assets/72427a11-eb43-42d6-a726-f154a6c8f36a" />

<img width="1053" height="720" alt="image" src="https://github.com/user-attachments/assets/e6a3424f-3307-4311-a00e-993fa8585d02" />


## Configuration Files

All configuration files are stored in the Config Server under `/configurations/`:

* `eureka-server.yml` - Eureka service discovery configuration
* `gateway.yml` - API Gateway routes and settings
* `user-service.yml` - User service and MongoDB configuration

---

## User Service (via Gateway)

**Create User:**

```bash
curl -X POST http://localhost:8090/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "test"
  }'
```

---

