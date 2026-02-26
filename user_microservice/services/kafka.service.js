const { Kafka } = require('kafkajs');
const UserProfile = require('../models/user.model');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'user-microservice',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ 
  groupId: process.env.KAFKA_GROUP_ID || 'user-service-group' 
});

/**
 * Consumer Kafka pour écouter les événements de réservation
 */
async function consumeBookingEvents() {
  try {
    await consumer.connect();
    await consumer.subscribe({ 
      topic: 'booking-events', 
      fromBeginning: false 
    });

    console.log('✅ Kafka Consumer connected - Listening to booking-events');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          console.log('📨 Received booking event:', event);

          // Traiter l'événement selon son type
          switch (event.eventType) {
            case 'CREATED':
              await handleBookingCreated(event);
              break;
            case 'UPDATED':
              await handleBookingUpdated(event);
              break;
            case 'CANCELLED':
              await handleBookingCancelled(event);
              break;
            default:
              console.log('Unknown event type:', event.eventType);
          }
        } catch (error) {
          console.error('Error processing booking event:', error);
        }
      },
    });
  } catch (error) {
    console.error('❌ Kafka Consumer error:', error.message);
    // Ne pas bloquer le démarrage si Kafka n'est pas disponible
  }
}

/**
 * Gérer la création d'une réservation
 */
async function handleBookingCreated(event) {
  console.log(`✅ Booking CREATED for user ${event.userId}`);
  
  try {
    // Mettre à jour les statistiques utilisateur
    const userProfile = await UserProfile.findOneAndUpdate(
      { keycloakUserId: event.userId },
      {
        $inc: { 
          'statistics.totalBookings': 1,
          'statistics.totalSpent': event.totalPrice || 0,
          loyaltyPoints: Math.floor((event.totalPrice || 0) / 10) // 1 point par 10€
        },
        $set: {
          'statistics.lastBookingDate': new Date()
        }
      },
      { upsert: true, new: true }
    );
    
    console.log(`📊 User ${event.userId} statistics updated:`, {
      totalBookings: userProfile.statistics.totalBookings,
      loyaltyPoints: userProfile.loyaltyPoints
    });
  } catch (error) {
    console.error('Error updating user statistics:', error);
  }
}

/**
 * Gérer la mise à jour d'une réservation
 */
async function handleBookingUpdated(event) {
  console.log(`📝 Booking UPDATED for user ${event.userId}`);
  // Logique supplémentaire si nécessaire
}

/**
 * Gérer l'annulation d'une réservation
 */
async function handleBookingCancelled(event) {
  console.log(`❌ Booking CANCELLED for user ${event.userId}`);
  
  try {
    // Décrémenter les statistiques
    await UserProfile.findOneAndUpdate(
      { keycloakUserId: event.userId },
      {
        $inc: { 
          'statistics.totalBookings': -1,
          'statistics.totalSpent': -(event.totalPrice || 0)
        }
      }
    );
  } catch (error) {
    console.error('Error updating user statistics on cancellation:', error);
  }
}

module.exports = { consumeBookingEvents };
