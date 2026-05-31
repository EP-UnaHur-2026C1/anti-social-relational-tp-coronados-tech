const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser} = require ( "../controllers/user.controller.js" )
const { userSchema, updateUserSchema } = require("../schemas/user.schema");

const { User } = require("../db/models");

const schemaValidatorMiddleware = require("../middlewares/validations/schema.middleware.js");
const existValidateMiddleware = require("../middlewares/validations/exist.middleware.js");
const numericParamValidateMiddleware = require("../middlewares/validations/numeric.middleware.js");

router.get("/", getAllUsers);

router.post(
    "/", 
    schemaValidatorMiddleware(userSchema), 
    createUser
);

router.get(
    "/:id", 
    numericParamValidateMiddleware("id"), 
    existValidateMiddleware(User, "id"), 
    getUserById
);

router.put(
    "/:id", 
    numericParamValidateMiddleware("id"), 
    existValidateMiddleware(User, "id"), 
    schemaValidatorMiddleware(updateUserSchema), 
    updateUser
);

router.delete(
    "/:id", 
    numericParamValidateMiddleware("id"), 
    existValidateMiddleware(User, "id"), 
    deleteUser
);

module.exports = router;