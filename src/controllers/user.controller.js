const HTTP = require("../config/HttpCode");
const { User } = require('../db/models');

// POST/users - crea un nuevo usuario
const createUser = async (req, res) =>{
    const data = req.body;
    const user = await User.create(data);
    res.status(HTTP.CREATED).json(user);
}

//GET/users - obtiene todos los usuarios
const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.status(HTTP.OK).json(users);
}

//GET/users/:id - obtiene un usuario por su ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.status(HTTP.OK).json(user);
}

//PUT/users/:id - actualiza un usuario por su ID
const updateUser = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const user = await User.findByPk(id);
    await user.update(data);
    res.status(HTTP.OK).json(user);
}

//DELETE/users/:id - elimina un usuario por su ID
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    await user.destroy();
    res.status(HTTP.OK).json({ message: "Usuario eliminado exitosamente" });
}


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};