const Joi = require('joi');

/**
 * Validation schema for creating a user
 */
const createUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'any.required': 'Name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        })
});

const validateUser = (data) => {
    return createUserSchema.validate(data);
};

module.exports = {
    validateUser
};
