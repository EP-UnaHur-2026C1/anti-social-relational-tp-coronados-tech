const Joi = require("joi");

const postIdField = Joi.number().integer().positive().messages({
    "any.required": "postId es requerido",
    "number.base": "postId debe ser un número",
    "number.integer": "postId debe ser un número entero",
    "number.positive": "postId debe ser mayor a 0",
});

const createPostImageSchema = Joi.object({
    postId: postIdField.required(),
}).unknown(true);

const updatePostImageSchema = Joi.object({
    postId: postIdField.optional(),
}).min(1);

module.exports = { createPostImageSchema, updatePostImageSchema };
