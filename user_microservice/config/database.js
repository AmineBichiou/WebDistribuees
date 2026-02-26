const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('⚠️  MongoDB non disponible - Mode dégradé (Keycloak uniquement)');
    console.log('   Les profils utilisateurs (stats, points) ne seront pas sauvegardés');
    console.log('   💡 Erreur de connexion:', error.message);
    console.log('   💡 Pour résoudre: Vérifiez Network Access dans MongoDB Atlas\n');
    // En développement, continuer même si MongoDB n'est pas disponible
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
