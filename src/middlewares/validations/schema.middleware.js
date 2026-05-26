
const schemaValidatorMiddleware = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body ?? {}, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (result.error) {
      return res.status(400).json({
        errores: result.error.details.map((e) => ({
          atributo: e.path[0] || "body",
          error: e.message,
        })),
      });
    }
    req.body = result.value;
    next();
  };
};

module.exports = schemaValidatorMiddleware