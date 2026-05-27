const Joi = require("joi");

const contentField = Joi.string().trim().min(1).max(150).messages({
  "any.required": "content es requerido",
  "string.empty": "content no puede estar vacío",
  "string.min": "content debe tener al menos {#limit} carácter",
  "string.max": "content debe tener como máximo {#limit} caracteres",
});

const isVisibleField = Joi.boolean().messages({
  "any.required": "isVisible es requerido",
  "boolean.base": "isVisible debe ser un valor booleano",
});

const postIdField = Joi.number().integer().positive().messages({
  "any.required": "post_id es requerido",
  "number.base": "post_id debe ser un número",
  "number.integer": "post_id debe ser un número entero",
  "number.positive": "post_id debe ser mayor a 0",
});

const userIdField = Joi.number().integer().positive().messages({
  "any.required": "user_id es requerido",
  "number.base": "user_id debe ser un número",
  "number.integer": "user_id debe ser un número entero",
  "number.positive": "user_id debe ser mayor a 0",
});

const commentSchema = Joi.object({
  content: contentField.required(),
  post_id: postIdField.required(),
  user_id: userIdField.required(),
});

const updateCommentSchema = Joi.object({
  content: contentField.optional(),
}).min(1);

module.exports = { commentSchema, updateCommentSchema };
