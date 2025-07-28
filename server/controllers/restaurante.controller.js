const { Op } = require('sequelize');
const Restaurantes = require('../models/restaurante.model');

module.exports.CreateRestaurante =  async (request, response) => {
    const { nombre, direccion, reputacion, url } = request.body;
    try {
        // Validar si ya existe un restaurante con el mismo nombre y dirección
        const existente = await Restaurantes.findOne({ where: { nombre, direccion } });
        if (existente) {
            return response.status(409).json({
                status: "error",
                message: "Ya existe un restaurante con ese nombre y dirección"
            });
        }
        const Restaurante = await Restaurantes.create({
            nombre,
            direccion,
            reputacion,
            url
        });
        response.status(201).json({
            status: "ok",
            message: "Restaurante creado correctamente",
            data: Restaurante
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el restaurante",
            error: error.message
        });
    }
};

module.exports.getAllRestaurantes = async (_, response) => {
    try {
        const restaurantes = await Restaurantes.findAll();
        response.json(restaurantes);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los restaurantes",
            error: error.message
        });
    }
}

module.exports.getRestaurante = async (request, response) => {
    try {
        const restaurante = await Restaurantes.findOne({ where: { id: request.params.id } }); // Cambiado _id por id
        if (!restaurante) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }
        response.json(restaurante);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener el restaurante",
            error: error.message
        });
    }
}

module.exports.updateRestaurante = async (request, response) => {
    const { nombre, direccion, reputacion, url } = request.body;
    try {
        const [updated] = await Restaurantes.update({
            nombre,
            direccion,
            reputacion,
            url
        }, {
            where: { id: request.params.id } // Cambiado _id por id
        });

        if (!updated) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }

        const updatedRestaurante = await Restaurantes.findOne({ where: { id: request.params.id } }); // Cambiado _id por id
        response.json({
            status: "ok",
            message: "Restaurante actualizado correctamente",
            data: updatedRestaurante
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el restaurante",
            error: error.message
        });
    }
}

module.exports.deleteRestaurante = async (request, response) => {
    const { id } = request.params;

    try {
        const deleted = await Restaurantes.destroy({ where: { id } }); // Cambiado _id por id

        if (!deleted) {
            return response.status(404).json({
                status: "error",
                message: "Restaurante no encontrado"
            });
        }

        response.json({
            status: "ok",
            message: "Restaurante eliminado correctamente"
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el restaurante",
            error: error.message
        });
    }
}

module.exports.getRestaurantesByReputacion = async (request, response) => {
    const { min, max } = request.query;

    try {
        const restaurantes = await Restaurantes.findAll({
            where: {
                reputacion: {
                    [Op.between]: [min, max]
                }
            }
        });

        if (restaurantes.length === 0) {
            return response.status(404).json({
                status: "error",
                message: "No se encontraron restaurantes con esa reputación"
            });
        }

        response.json(restaurantes);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los restaurantes por reputación",
            error: error.message
        });
    }
}
