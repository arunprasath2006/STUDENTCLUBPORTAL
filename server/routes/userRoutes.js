const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// @route   POST /api/users
// @desc    Insert a new user document
router.post('/', userController.createUser);

// @route   GET /api/users
// @desc    Get all users
router.get('/', userController.getAllUsers);

module.exports = router;
