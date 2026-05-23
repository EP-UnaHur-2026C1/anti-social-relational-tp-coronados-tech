const numericParamValidateMiddleware = (fieldNumeric) => {
 return async (req, res, next) => {
    const id = req.params[fieldNumeric]
    if (isNaN(id)) {
        return res.status(400).json({
            message: res.__('parameter_numeric', { field: fieldNumeric }),
        })
    }
    next()
 }
}

module.exports = numericParamValidateMiddleware