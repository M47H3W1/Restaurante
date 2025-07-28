const {DataTypes} = require("sequelize");
const sequelize = require('../config/sequelize.config');

const TipoComida = sequelize.define("TipoComida", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "El tipo es obligatorio" },
            len: [1, 50] // Longitud máxima de 100 caracteres
        }
    },
    paisOrigen: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "El pais de origen es obligatoria" },
            len: [1, 100] // Longitud máxima de 200 caracteres
        }
    }
}
,{ timestamps: false}
);

module.exports = TipoComida;