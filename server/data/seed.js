const sequelize = require('../config/sequelize.config');
const TipoComida = require('../models/tipoComida.model');
const Usuario = require('../models/user.model');
const Restaurante = require('../models/restaurante.model');
const Menu = require('../models/menu.model');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // NO sincronices aquí, solo inserta datos
    // 1. Tipos de comida
    const tipos = [
      { nombre: 'Italiana', paisOrigen: 'Italia' },
      { nombre: 'Mexicana', paisOrigen: 'México' },
      { nombre: 'Japonesa', paisOrigen: 'Japón' },
      { nombre: 'China', paisOrigen: 'China' },
      { nombre: 'Argentina', paisOrigen: 'Argentina' }
    ];
    const tiposCreados = [];
    for (const tipo of tipos) {
      const [t, created] = await TipoComida.findOrCreate({ where: tipo });
      tiposCreados.push(t);
    }

    // 2. Usuarios
    const usuarios = [
      { userName: 'admin', email: 'admin@epn.edu.ec', password: 'admin123' },
      { userName: 'user', email: 'mathew.gutierrez@epn.edu.ec', password: 'usuario123' }
    ];
    for (const u of usuarios) {
      const hash = await bcrypt.hash(u.password, 10);
      await Usuario.findOrCreate({
        where: { email: u.email },
        defaults: { userName: u.userName, password: hash }
      });
    }

    // 3. Restaurantes
    const restaurantes = [
      {
        nombre: 'La Trattoria',
        direccion: 'Av. Italia 123',
        reputacion: 5,
        url: 'https://www.westernunion.com/blogs-staticassets/R25-07.05.0-163/media/Que_comidas_tipicas_Italia_debes_probar.jpg'
      },
      {
        nombre: 'El Mariachi',
        direccion: 'Calle México 456',
        reputacion: 4,
        url: 'https://www.recetasnestle.com.ec/sites/default/files/2023-08/platos-ingredientes-comida-mexicana_0.jpg'
      }
    ];
    const restaurantesCreados = [];
    for (const r of restaurantes) {
      const [rest, created] = await Restaurante.findOrCreate({ where: { nombre: r.nombre }, defaults: r });
      restaurantesCreados.push(rest);
    }

    // 4. Menús (relacionar restaurantes con tipos de comida)
    // La Trattoria: Italiana y Argentina
    await Menu.findOrCreate({
      where: { restaurante_id: restaurantesCreados[0].id, tipoComidaId: tiposCreados[0].id }
    });
    await Menu.findOrCreate({
      where: { restaurante_id: restaurantesCreados[0].id, tipoComidaId: tiposCreados[4].id }
    });
    // El Mariachi: Mexicana y China
    await Menu.findOrCreate({
      where: { restaurante_id: restaurantesCreados[1].id, tipoComidaId: tiposCreados[1].id }
    });
    await Menu.findOrCreate({
      where: { restaurante_id: restaurantesCreados[1].id, tipoComidaId: tiposCreados[3].id }
    });

    console.log('Datos de prueba insertados correctamente.');
  } catch (err) {
    console.error('Error al insertar datos de prueba:', err);
  }
}

module.exports = seed;