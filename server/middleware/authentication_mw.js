require("dotenv").config();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user.model'); // Importar el modelo de Usuario

module.exports.protect = async (req, res, next) => {
    let token;

    // Verificar si el token está en los headers de autorización
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization;
            console.log("Token recibido:", token);
            token = token.split(' ')[1];
            console.log("Token procesado:", token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Usuario.findByPk(decoded.id); // Buscar el usuario por ID
            req.user.password = undefined; // No enviar la contraseña en la respuesta
            next(); // Continuar con la siguiente función middleware o ruta
        } catch (error) {
            res.status(401).json({ message: 'No autorizado' });   
        }
    }

    // Si no hay token, retornar un error
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token de autorización' });
    }
}