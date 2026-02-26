require('dotenv').config();
const axios = require('axios');

console.log('🔍 Vérification des services...\n');

async function checkServices() {
  const services = [
    {
      name: 'Keycloak',
      url: `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      required: true
    },
    {
      name: 'Kafka',
      url: 'http://localhost:9090',
      required: false
    },
    {
      name: 'API Gateway',
      url: 'http://localhost:8090/actuator/health',
      required: false
    },
    {
      name: 'Booking Service',
      url: 'http://localhost:8082/api/bookings/health',
      required: false
    }
  ];

  for (const service of services) {
    try {
      await axios.get(service.url, { timeout: 2000 });
      console.log(`✅ ${service.name} - OK (${service.url})`);
    } catch (error) {
      if (service.required) {
        console.log(`❌ ${service.name} - REQUIS mais non disponible!`);
        console.log(`   URL: ${service.url}`);
        console.log(`   Erreur: ${error.message}\n`);
      } else {
        console.log(`⚠️  ${service.name} - Optionnel (pas démarré)`);
      }
    }
  }

  console.log('\n📋 Configuration:');
  console.log(`   PORT: ${process.env.PORT}`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI}`);
  console.log(`   KAFKA_BROKER: ${process.env.KAFKA_BROKER}`);
  
  console.log('\n💡 Prêt à démarrer! Exécuter: npm start\n');
}

checkServices();
