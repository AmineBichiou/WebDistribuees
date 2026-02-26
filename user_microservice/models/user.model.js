const mongoose = require('mongoose');

// Données métier supplémentaires (pas dans Keycloak)
const userProfileSchema = new mongoose.Schema({
  keycloakUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  preferences: {
    language: { type: String, default: 'fr' },
    currency: { type: String, default: 'EUR' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  statistics: {
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastBookingDate: { type: Date }
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
