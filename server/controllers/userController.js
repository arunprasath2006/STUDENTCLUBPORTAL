const userService = require('../services/userService');
const { validateUser } = require('../validations/userValidation');

/**
 * Controller to handle User-related HTTP requests
 */
const userController = {
    /**
     * Create a new user
     */
    createUser: async (req, res) => {
        try {
            // 1. Validate request body
            const { error, value } = validateUser(req.body);
            if (error) {
                return res.status(400).json({
                    error: error.details[0].message
                });
            }

            // 2. Call service to insert data
            const newUser = await userService.createUser(value);

            // 3. Return response
            res.status(201).json({
                message: 'User created successfully',
                user: newUser
            });
        } catch (err) {
            console.error('Error in createUser controller:', err.message);
            res.status(500).json({ error: 'Server error while creating user' });
        }
    },

    /**
     * Get all users
     */
    getAllUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            console.error('Error in getAllUsers controller:', err.message);
            res.status(500).json({ error: 'Server error while fetching users' });
        }
    }
};

module.exports = userController;
