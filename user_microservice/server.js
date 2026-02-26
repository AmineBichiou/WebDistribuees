require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { consumeBookingEvents } = require('./services/kafka.service');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Démarrer le consumer Kafka
consumeBookingEvents().catch(console.error);

// Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    service: 'User Microservice (Node.js)',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   User Microservice (Node.js) Started    ║
╠═══════════════════════════════════════════╣
║  Port:        ${PORT}                        ║
║  Keycloak:    ${process.env.KEYCLOAK_BASE_URL}     ║
║  MongoDB:     Connected                   ║
║  Kafka:       Listening...                ║
╚═══════════════════════════════════════════╝
  `);
});
