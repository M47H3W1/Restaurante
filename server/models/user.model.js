const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config.js'); // Corregido el path

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        validate: {
            notNull: { msg: "El id es obligatorio" }
        }
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El nombre de usuario es obligatorio" },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El correo electrónico es obligatorio" },
            isEmail: { msg: "El correo electrónico debe ser válido" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is requiered" }
        }
    },
}, {
    timestamps: false
});

module.exports = Usuario;