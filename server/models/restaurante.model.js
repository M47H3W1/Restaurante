const {DataTypes} = require("sequelize");
const sequelize = require('../config/sequelize.config');

const Restaurantes = sequelize.define("Restaurantes", {
    id: { // Cambiado de _id a id
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "El nombre del restaurante es obligatorio" },
            len: [1, 100] // Longitud máxima de 100 caracteres
        }
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "La dirección del restaurante es obligatoria" },
            len: [1, 200] // Longitud máxima de 200 caracteres
        }
    },
    reputacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: "La reputación del restaurante es obligatoria" },
            min: 1,
            max: 5
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "La URL del restaurante es obligatoria" },
            is: {
                args: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[^\s]*)?(\?[^\s]*)?$/i,
                msg: "La URL proporcionada no es válida"
            }
        }
    }
}, { timestamps: false });

module.exports = Restaurantes;