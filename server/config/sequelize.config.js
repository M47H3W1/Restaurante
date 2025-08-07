const { Sequelize } = require("sequelize");

const username = "root";
//const password = "root";
const password = "admin";
const bdd_name = "Restaurante";
const hostName = "localhost";

const initialSequelize = new Sequelize(`mysql://${username}:${password}@localhost`);

initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`)
    .then(() => console.log("DBB creada o ya existía"))
    .catch((error) => {
        console.error("Error al crear la BDD", error);
        process.exit(1);
    });

const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: "mysql",
});

//EN el sync si se utiliza el parametro de entrafa force: true, se eliminan las tablas existentes y se crean de nuevo
//Con el alter:true se actualizan las tablas existentes sin perder los datos, pero puede causar problemas si hay cambios incompatibles (Hace el mejor intento de mantener los datos)
//Lo recomendable en el desarrollo es usar force true
//En producción no se debe utilizar ninguno.
sequelize.sync({ force: true }).then(() => {
//sequelize.sync().then(() => {
    console.log("Base de datos sincronizada");
}).catch((error) => {
    console.error("Error al sincronizar la base de datos", error);
});

module.exports = sequelize;
