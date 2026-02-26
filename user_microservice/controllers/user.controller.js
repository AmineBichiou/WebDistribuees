const keycloakService = require('../services/keycloak.service');
const UserProfile = require('../models/user.model');

class UserController {

  /**
   * GET /api/users - Récupérer tous les utilisateurs
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await keycloakService.getAllUsers();
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id - Récupérer un utilisateur par ID
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Récupérer les données de Keycloak
      const keycloakUser = await keycloakService.getUserById(id);
      
      // Récupérer les données métier de MongoDB
      const userProfile = await UserProfile.findOne({ keycloakUserId: id });
      
      res.json({
        success: true,
        data: {
          ...keycloakUser,
          profile: userProfile || null
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users - Créer un nouvel utilisateur
   */
  async createUser(req, res, next) {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username, email and password are required'
        });
      }

      // Créer dans Keycloak
      const newUser = await keycloakService.createUser({
        username,
        email,
        password,
        firstName,
        lastName
      });

      // Créer le profil dans MongoDB
      const userProfile = await UserProfile.create({
        keycloakUserId: newUser.id
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: newUser.id,
          username,
          email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id - Mettre à jour un utilisateur
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email } = req.body;

      await keycloakService.updateUser(id, {
        firstName,
        lastName,
        email
      });

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id - Supprimer un utilisateur
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Supprimer de Keycloak
      await keycloakService.deleteUser(id);

      // Supprimer le profil de MongoDB
      await UserProfile.findOneAndDelete({ keycloakUserId: id });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id/profile - Récupérer le profil utilisateur (MongoDB)
   */
  async getUserProfile(req, res, next) {
    try {
      const { id } = req.params;
      
      const userProfile = await UserProfile.findOne({ keycloakUserId: id });
      
      if (!userProfile) {
        return res.status(404).json({
          success: false,
          error: 'User profile not found'
        });
      }

      res.json({
        success: true,
        data: userProfile
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id/profile - Mettre à jour le profil utilisateur
   */
  async updateUserProfile(req, res, next) {
    try {
      const { id } = req.params;
      const { preferences, loyaltyPoints } = req.body;

      const userProfile = await UserProfile.findOneAndUpdate(
        { keycloakUserId: id },
        { 
          preferences,
          loyaltyPoints,
          updatedAt: Date.now()
        },
        { new: true, upsert: true }
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: userProfile
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/:id/roles - Assigner un rôle
   */
  async assignRole(req, res, next) {
    try {
      const { id } = req.params;
      const { roleName } = req.body;

      if (!roleName) {
        return res.status(400).json({
          success: false,
          error: 'roleName is required'
        });
      }

      await keycloakService.assignRole(id, roleName);

      res.json({
        success: true,
        message: `Role ${roleName} assigned successfully`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id/roles - Récupérer les rôles d'un utilisateur
   */
  async getUserRoles(req, res, next) {
    try {
      const { id } = req.params;
      const roles = await keycloakService.getUserRoles(id);

      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
