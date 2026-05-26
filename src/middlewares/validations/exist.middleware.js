const existValidateMiddleware = (Modelo, field) => {
  return async (req, res, next) => {
    console.log("req");
    console.log(req.body);
    const id = req.body?.[field] ?? req.params[field];
    console.log(field);
    console.log(id);

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
