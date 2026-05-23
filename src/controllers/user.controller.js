const { User } = require('../db/models');

// POST/users - crea un nuevo usuario
const createUser = async (req, res) =>{
    try {
        const data = req.body;
        const user = await User.create(data);
        res.status(201).json(user);
    } catch (error){
        res.status(500).json({ message: "Error al crear el usuario:", error: error.message });
    }
}

//GET/users - obtiene todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios:", error: error.message });
    }
}

//GET/users/:id - obtiene un usuario por su ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario:", error: error.message });
    }
}

//PUT/users/:id - actualiza un usuario por su ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        await user.update(data);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario:", error: error.message });
    }
}

//DELETE/users/:id - elimina un usuario por su ID
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        await user.destroy();
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario:", error: error.message });
    }
}


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};