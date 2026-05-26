const Joi = require("joi");

const descriptionField = Joi.string().trim().min(1).max(5000).messages({
  "any.required": "description es requerido",
  "string.empty": "description no puede estar vacío",
  "string.min": "description debe tener al menos {#limit} carácter",
  "string.max": "description debe tener como máximo {#limit} caracteres",
});

const userIdField = Joi.number().integer().positive().messages({
  "any.required": "user_id es requerido",
  "number.base": "user_id debe ser un número",
  "number.integer": "user_id debe ser un número entero",
  "number.positive": "user_id debe ser mayor a 0",
});

const postSchema = Joi.object({
  description: descriptionField.required(),
  user_id: userIdField.required(),
});

const updatePostSchema = Joi.object({
  description: descriptionField.optional(),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "Debe enviar al menos un campo para actualizar",
  });

module.exports = { postSchema, updatePostSchema };
