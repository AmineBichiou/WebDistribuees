const { kcAdminClient, authenticate } = require('../config/keycloak.config');

class KeycloakService {
  
  /**
   * Récupérer tous les utilisateurs
   */
  async getAllUsers() {
    try {
      await authenticate();
      const users = await kcAdminClient.users.find();
      return users;
    } catch (error) {
      throw new Error(`Erreur Keycloak getAllUsers: ${error.message}`);
    }
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(userId) {
    try {
      await authenticate();
      const user = await kcAdminClient.users.findOne({ id: userId });
      if (!user) {
        throw new Error('User not found in Keycloak');
      }
      return user;
    } catch (error) {
      throw new Error(`Erreur Keycloak getUserById: ${error.message}`);
    }
  }

  /**
   * Récupérer un utilisateur par email
   */
  async getUserByEmail(email) {
    try {
      await authenticate();
      const users = await kcAdminClient.users.find({ email });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw new Error(`Erreur Keycloak getUserByEmail: ${error.message}`);
    }
  }

  /**
   * Créer un nouvel utilisateur
   */
  async createUser(userData) {
    try {
      await authenticate();
      const newUser = await kcAdminClient.users.create({
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        enabled: true,
        emailVerified: false,
        credentials: [{
          type: 'password',
          value: userData.password,
          temporary: false
        }]
      });
      return newUser;
    } catch (error) {
      throw new Error(`Erreur Keycloak createUser: ${error.message}`);
    }
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(userId, userData) {
    try {
      await authenticate();
      await kcAdminClient.users.update(
        { id: userId },
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        }
      );
      return { message: 'User updated successfully' };
    } catch (error) {
      throw new Error(`Erreur Keycloak updateUser: ${error.message}`);
    }
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId) {
    try {
      await authenticate();
      await kcAdminClient.users.del({ id: userId });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Erreur Keycloak deleteUser: ${error.message}`);
    }
  }

  /**
   * Assigner un rôle à un utilisateur
   */
  async assignRole(userId, roleName) {
    try {
      await authenticate();
      const role = await kcAdminClient.roles.findOneByName({ name: roleName });
      if (!role) {
        throw new Error(`Role ${roleName} not found`);
      }
      
      await kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        roles: [{
          id: role.id,
          name: role.name
        }]
      });
      return { message: `Role ${roleName} assigned successfully` };
    } catch (error) {
      throw new Error(`Erreur Keycloak assignRole: ${error.message}`);
    }
  }

  /**
   * Récupérer les rôles d'un utilisateur
   */
  async getUserRoles(userId) {
    try {
      await authenticate();
      const roles = await kcAdminClient.users.listRealmRoleMappings({ id: userId });
      return roles;
    } catch (error) {
      throw new Error(`Erreur Keycloak getUserRoles: ${error.message}`);
    }
  }
}

module.exports = new KeycloakService();
