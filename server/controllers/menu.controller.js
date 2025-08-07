const Menu = require('../models/menu.model');
const TipoComida = require('../models/tipoComida.model');
const Restaurantes = require('../models/restaurante.model');

module.exports.CreateMenu = async (request, response) => {
    const { fecha, tipoComidaId, restaurante_id } = request.body;

    if (!tipoComidaId || !restaurante_id) {
        return response.status(400).json({
            status: "error",
            message: "tipoComidaId y restaurante_id son obligatorios"
        });
    }

    try {
        const restaurante = await Restaurantes.findByPk(restaurante_id);
        if (!restaurante) {
            return response.status(404).json({
                status: "error",
                message: "El restaurante no existe"
            });
        }

        const tipoComida = await TipoComida.findByPk(tipoComidaId);
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "El tipo de comida no existe"
            });
        }

        const existingMenu = await Menu.findOne({
            where: {
                restaurante_id,
                tipoComidaId
            }
        });

        if (existingMenu) {
            return response.status(409).json({
                status: "error",
                message: "Ya existe un menú para esta combinación de restaurante y tipo de comida"
            });
        }

        const newMenu = await Menu.create({
            fecha: fecha || new Date(),
            tipoComidaId,
            restaurante_id
        });

        response.status(201).json({
            status: "ok",
            message: "Menú creado correctamente",
            data: newMenu
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al crear el menú",
            error: error.message
        });
    }
}

// Obtener los tipos de comida que ofrece un restaurante en concreto
module.exports.getMenuByRestaurante = async (request, response) => {    
    try {
        const menus = await Menu.findAll({
            where: { restaurante_id: request.params.id },
            include: [
                { model: TipoComida }
            ]
        });
        if (!menus.length) {
            return response.status(404).json({
                status: "error",
                message: "No se encontraron tipos de comida para el restaurante solicitado"
            });
        }
        // Extraer solo los tipos de comida y evitar duplicados
        const tiposComida = [];
        const ids = new Set();
        for (const menu of menus) {
            if (menu.TipoComida && !ids.has(menu.TipoComida.id)) {
                tiposComida.push(menu.TipoComida);
                ids.add(menu.TipoComida.id);
            }
        }
        response.json(tiposComida);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los tipos de comida",
            error: error.message
        });
    }
}

//Dado el idTIpoComida se obtenga los restaurantes que ofrecen ese tipo de comida, 
// primero validar que el id existe, si no existe este tipo de comida lo indica al usuario

module.exports.getRestaurantesByTipoComida = async (request, response) => {
    const { idTipoComida } = request.params;
    if (!idTipoComida) {
        return response.status(400).json({
            status: "error",
            message: "El idTipoComida es obligatorio"
        });
    }
    try {
        // Validar que el tipo de comida exista
        const tipoComida = await TipoComida.findByPk(idTipoComida);
        if (!tipoComida) {
            return response.status(404).json({
                status: "error",
                message: "El tipo de comida no existe"
            });
        }

        const restaurantes = await Restaurantes.findAll({
            include: [{
                model: TipoComida,
                where: { id: idTipoComida },
                attributes: [] // <-- No incluir datos de TipoComida en la respuesta
            }]
        });
        if (!restaurantes.length) {
            return response.status(404).json({
                status: "error",
                message: "No se encontraron restaurantes para el tipo de comida solicitado"
            });
        }
        response.json(restaurantes);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los restaurantes",
            error: error.message
        });
    }
}

// Filtrar restaurantes por uno o varios tipos de comida
module.exports.getRestaurantesByTiposComida = async (request, response) => {
    let tipos = request.query.tipos;
    if (!tipos) {
        return response.status(400).json({
            status: "error",
            message: "Debe proporcionar al menos un id de tipo de comida en el query ?tipos=1,2"
        });
    }
    // Permitir recibir un solo valor o varios separados por coma
    if (typeof tipos === "string") {
        tipos = tipos.split(',').map(id => id.trim());
    }
    try {
        // Validar que todos los tipos existan
        const tiposExistentes = await TipoComida.findAll({ where: { id: tipos } });
        if (tiposExistentes.length !== tipos.length) {
            return response.status(404).json({
                status: "error",
                message: "Uno o más tipos de comida no existen"
            });
        }
        // Buscar restaurantes que tengan al menos uno de los tipos indicados
        const restaurantes = await Restaurantes.findAll({
            include: [{
                model: TipoComida,
                where: { id: tipos },
                attributes: []
            }],
            distinct: true
        });
        if (!restaurantes.length) {
            return response.status(404).json({
                status: "error",
                message: "No se encontraron restaurantes para los tipos de comida solicitados"
            });
        }
        response.json(restaurantes);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al filtrar los restaurantes",
            error: error.message
        });
    }
}

// Obtener un menú por su id
module.exports.getMenuById = async (request, response) => {
    try {
        const menu = await Menu.findByPk(request.params.id, {
            include: [
                { model: TipoComida },
                { model: Restaurantes }
            ]
        });
        if (!menu) {
            return response.status(404).json({
                status: "error",
                message: "Menú no encontrado"
            });
        }
        response.json(menu);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener el menú",
            error: error.message
        });
    }
};

// Actualizar un menú
module.exports.updateMenu = async (request, response) => {
    try {
        const { fecha, tipoComidaId, restaurante_id } = request.body;
        const menu = await Menu.findByPk(request.params.id);
        if (!menu) {
            return response.status(404).json({
                status: "error",
                message: "Menú no encontrado"
            });
        }
        menu.fecha = fecha || menu.fecha;
        menu.tipoComidaId = tipoComidaId || menu.tipoComidaId;
        menu.restaurante_id = restaurante_id || menu.restaurante_id;
        await menu.save();
        response.json({
            status: "ok",
            message: "Menú actualizado correctamente",
            data: menu
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al actualizar el menú",
            error: error.message
        });
    }
};

// Eliminar un menú
module.exports.deleteMenu = async (request, response) => {
    try {
        const menu = await Menu.findByPk(request.params.id);
        if (!menu) {
            return response.status(404).json({
                status: "error",
                message: "Menú no encontrado"
            });
        }
        await menu.destroy();
        response.json({
            status: "ok",
            message: "Menú eliminado correctamente"
        });
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al eliminar el menú",
            error: error.message
        });
    }
};

// Listar todos los menús
module.exports.getAllMenus = async (request, response) => {
    try {
        const menus = await Menu.findAll({
            include: [
                { model: TipoComida },
                { model: Restaurantes }
            ]
        });
        response.json(menus);
    } catch (error) {
        response.status(500).json({
            status: "error",
            message: "Error al obtener los menús",
            error: error.message
        });
    }
};
