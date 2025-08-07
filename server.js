const express = require('express')
const cors = require('cors');
const app = express();
const port = 8000;

const sequelize = require('./server/config/sequelize.config.js'); 
const seed = require('./server/data/seed.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allRestauranteRoutes = require('./server/routes/restaurante.routes');
const allTipoComidaRoutes = require('./server/routes/tipoComida.routes');
const allMenuRoutes = require('./server/routes/menu.routes');
const allUsuarioRoutes = require('./server/routes/user.routes');

allRestauranteRoutes(app);
allTipoComidaRoutes(app); 
allMenuRoutes(app); 
allUsuarioRoutes(app); 

// Espera a que la base esté sincronizada y luego ejecuta el seed y levanta el servidor
sequelize.sync({ force: true }).then(async () => {
  console.log("Base de datos sincronizada");
  await seed();
  app.listen(port, () => {
    console.log("Server corriendo en el puerto: ", port);
  });
}).catch((error) => {
  console.error("Error al sincronizar la base de datos", error);
});