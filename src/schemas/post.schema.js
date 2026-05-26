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

const publicationDateField = Joi.date().iso().messages({
  "date.base": "publicationDate debe ser una fecha válida",
  "date.format": "publicationDate debe estar en formato ISO 8601",
});

const postSchema = Joi.object({
  description: descriptionField.required(),
  user_id: userIdField.required(),
  //publicationDate: publicationDateField.optional(),
  tags: Joi.array().items(Joi.string().trim().min(1)).optional(),
});

const updatePostSchema = Joi.object({
  description: descriptionField.optional(),
  user_id: userIdField.optional(),
  //publicationDate: publicationDateField.optional(),
}).min(1);

module.exports = { postSchema, updatePostSchema };
