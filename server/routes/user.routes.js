const UserController = require('../controllers/user.controller');

module.exports = function(app) {
    // Crear un nuevo usuario
    app.post('/usuarios/register', UserController.CreateUser);

    app.post('/usuarios/login', UserController.LoginUser);

    // Obtener todos los usuarios
    app.get('/usuarios', UserController.getAllUsers);

    // Obtener un usuario por ID
    app.get('/usuarios/:id', UserController.getUserById);

    // Actualizar un usuario por ID
    app.put('/usuarios/:id', UserController.updateUser);

    // Eliminar un usuario por ID
    app.delete('/usuarios/:id', UserController.deleteUser);
};