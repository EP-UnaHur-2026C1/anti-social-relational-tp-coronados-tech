const Joi = require("joi");

//pattern(/^[a-zA-Z0-9_.-]+$/) => Solo permite letras, números, guiones bajos, puntos y guiones
const nickname = Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .required()
    .messages ({
        "string.min": "El nickname debe tener al menos {#limit} caracteres",
        "string.max": "El nickname no puede tener más de {#limit} caracteres",
        "string.pattern.base": "El nickname solo puede contener letras, números, guiones bajos, puntos y guiones",
        "string.base": "El nickname debe ser un string",
        "string.empty": "El nickname no puede estar vacío",
        "any.required": "El nickname es obligatorio"
    });

//.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) => solo permite letras, incluye acentos, ñ y espaciados
const name = Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages ({
        "string.min": "El nombre debe tener al menos {#limit} caracteres",
        "string.max": "El nombre no puede tener más de {#limit} caracteres",
        "string.pattern.base": "El nombre solo puede contener letras, acentos, ñ y espacios",
        "string.base": "El nombre debe ser un string",
        "string.empty": "El nombre no puede estar vacío",
        "any.required": "El nombre es obligatorio"
    });

//.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) => solo permite letras, incluye acentos, ñ y espaciados
const lastName = Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
        "string.min": "El apellido debe tener al menos {#limit} caracteres",
        "string.max": "El apellido no puede tener más de {#limit} caracteres",
        "string.pattern.base": "El apellido solo puede contener letras, acentos, ñ y espacios",
        "string.base": "El apellido debe ser un string",
        "string.empty": "El apellido no puede estar vacío",
        "any.required": "El apellido es obligatorio"
    });

const email = Joi.string()
    .email()
    .required()
    .messages({
        "string.email": "El correo electrónico debe ser válido",
        "string.base": "El correo electrónico debe ser un string",
        "string.empty": "El correo electrónico no puede estar vacío",
        "any.required": "El correo electrónico es obligatorio"
    });

 //pattern(/^[a-zA-Z0-9_.-]+$/) => Solo permite letras, números, guiones bajos, puntos y guiones
const password = Joi.string()
    .min(6)
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .required()
    .messages({
        "string.min": "La contraseña debe tener al menos {#limit} caracteres",
        "string.pattern.base": "La contraseña solo puede contener letras, números, guiones bajos, puntos y guiones",
        "string.base": "La contraseña debe ser un string",
        "string.empty": "La contraseña no puede estar vacía",
        "any.required": "La contraseña es obligatoria"
    });

const birthDate = Joi.date()
    .less("now")
    .required()
    .messages({
        "date.base": "La fecha de nacimiento debe ser una fecha válida",
        "date.less": "La fecha de nacimiento debe ser anterior a hoy",
        "any.required": "La fecha de nacimiento es obligatoria",
        "date.empty": "La fecha de nacimiento no puede estar vacía"
    });

const gender = Joi.string()
    .valid("femenino", "masculino", "otro")
    .required()
    .messages({
        "string.base": "El género debe ser un string",
        "string.empty": "El género no puede estar vacío",
        "any.required": "El género es obligatorio",
        "any.only": "El género debe ser 'femenino', 'masculino' u 'otro'"
    });

const updateUserSchema = Joi.object({
  nickname: nickname.optional(),
  name: name.optional(),
  lastName: lastName.optional(),
  email: email.optional(),
  password: password.optional(),
  birthDate: birthDate.optional(),
  gender: gender.optional(),
}).min(1).messages({
  "object.min": "Al menos un campo debe ser proporcionado para actualizar el usuario"
});

const userSchema = Joi.object({
  nickname,
  name,
  lastName,
  email,
  password,
  birthDate,
  gender,
});

module.exports = { userSchema, updateUserSchema };
