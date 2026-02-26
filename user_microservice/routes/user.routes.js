const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Routes CRUD utilisateurs (Keycloak)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Routes profil utilisateur (MongoDB)
router.get('/:id/profile', userController.getUserProfile);
router.put('/:id/profile', userController.updateUserProfile);

// Routes rôles
router.get('/:id/roles', userController.getUserRoles);
router.post('/:id/roles', userController.assignRole);

module.exports = router;
