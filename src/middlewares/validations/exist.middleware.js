const existValidateMiddleware = (Modelo, field) => {
  return async (req, res, next) => {
    const id = req.params[field] ?? req.body?.[field];

    if (id == null || id === "") {
      return res.status(400).json({
        message: res.__("field_required", { field }),
      });
    }

    const entity = await Modelo.findByPk(id);
    if (!entity) {
      return res.status(404).json({
        message: res.__("id_dont_exist", { id, nombreModelo: Modelo.name }),
      });
    }

    next();
  };
};

module.exports = existValidateMiddleware;
