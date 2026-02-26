const KcAdminClient = require('@keycloak/keycloak-admin-client').default;

const kcAdminClient = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_BASE_URL,
  realmName: process.env.KEYCLOAK_REALM,
});

// Authentifier le client admin
async function authenticate() {
  try {
    await kcAdminClient.auth({
      username: process.env.KEYCLOAK_ADMIN_USERNAME,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: process.env.KEYCLOAK_CLIENT_ID,
    });
    console.log('✅ Keycloak Admin Client authenticated');
  } catch (error) {
    console.error('❌ Keycloak authentication failed:', error.message);
    throw error;
  }
}

module.exports = { kcAdminClient, authenticate };
