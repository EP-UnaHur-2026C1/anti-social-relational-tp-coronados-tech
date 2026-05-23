const Joi = require("joi");

const updatePostImageSchema = Joi.object({
  postId: Joi.number().integer().positive(),
}).min(1);

module.exports = updatePostImageSchema ;
