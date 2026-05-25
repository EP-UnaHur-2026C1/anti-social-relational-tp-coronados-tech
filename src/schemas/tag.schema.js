const Joi = require("joi");

const nameField = Joi.string().trim().min(1).max(25).messages({
  "any.required": "name es requerido",
  "string.empty": "name no puede estar vacío",
  "string.min": "name debe tener al menos {#limit} carácter",
  "string.max": "name debe tener como máximo {#limit} caracteres",
});

const tagSchema = Joi.object({
  name: nameField.required(),
});

const updateTagSchema = Joi.object({
  name: nameField.optional(),
}).min(1);

module.exports = { tagSchema, updateTagSchema };
