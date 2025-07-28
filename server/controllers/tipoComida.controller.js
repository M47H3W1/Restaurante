const TipoComida = require('../models/tipoComida.model');

module.exports.CreateTipoComida = async (request, response) => {
    const { nombre, paisOrigen } = request.body;
    try {
        const tipoComida = await TipoComida.create({
            nombre,
            paisOrigen
        });
        response.status(201).json({
            status: "ok",
            message: "Tipo de comida creado correctamente",
            data: tipoComida
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el tipo de comida",
            error: error.message
        });
    }
}

module.exports.getAllTipoComidas = async (_, response) => {
    try {
        const tiposComida = await TipoComida.findAll();
        response.json(tiposComida);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los tipos de comida",
            error: error.message
        });
    }
}
module.exports.getTipoComida = async (request, response) => {
    try {
        const tipoComida = await TipoComida.findOne({ where: { id: request.params.id } });
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "Tipo de comida no encontrado"
            });
        }
        response.json(tipoComida);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener el tipo de comida",
            error: error.message
        });
    }
}
module.exports.updateTipoComida = async (request, response) => {
    const { id } = request.params;
    const { nombre, paisOrigen } = request.body;
    try {
        const [updated] = await TipoComida.update(
            { nombre, paisOrigen },
            { where: { id } }
        );
        if (updated) {
            const updatedTipoComida = await TipoComida.findOne({ where: { id } });
            return response.status(200).json({ status: "ok", message: "Tipo de comida actualizado correctamente", data: updatedTipoComida });
        }
        throw new Error("Tipo de comida no encontrado");
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el tipo de comida",
            error: error.message
        });
    }
}
module.exports.deleteTipoComida = async (request, response) => {
    const { id } = request.params;
    try {
        const deleted = await TipoComida.destroy({ where: { id } });
        if (deleted) {
            return response.status(200).json({ status: "ok", message: "Tipo de comida eliminado correctamente" });
        }
        throw new Error("Tipo de comida no encontrado");
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el tipo de comida",
            error: error.message
        });
    }
}
