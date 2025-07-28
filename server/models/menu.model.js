const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Restaurantes = require('./restaurante.model');
const TipoComida = require('./tipoComida.model');

const Menu = sequelize.define('Menu', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    restaurante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Restaurantes,
            key: 'id'
        }
    },
    tipoComidaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoComida,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'Menus'
});

// Relación muchos a muchos
Restaurantes.belongsToMany(TipoComida, { through: Menu, foreignKey: 'restaurante_id', otherKey: 'tipoComidaId' });
TipoComida.belongsToMany(Restaurantes, { through: Menu, foreignKey: 'tipoComidaId', otherKey: 'restaurante_id' });

// Relaciones uno a muchos para include
Menu.belongsTo(Restaurantes, { foreignKey: 'restaurante_id' });
Menu.belongsTo(TipoComida, { foreignKey: 'tipoComidaId' });

module.exports = Menu;