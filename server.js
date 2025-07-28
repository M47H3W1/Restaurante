 const express = require('express')
 const cors = require('cors');
 const app = express();
 const port = 8000;

require('./server/config/sequelize.config.js'); 

 app.use(cors());
 app.use(express.json()); // Middleware para parsear JSON en el cuerpo de la solicitud
 app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
 //const allRestauranteRoutes = require('./server/routes/restaurante.routes');
 const allRestauranteRoutes = require('./server/routes/restaurante.routes');
 const allTipoComidaRoutes = require('./server/routes/tipoComida.routes');
 const allMenuRoutes = require('./server/routes/menu.routes');
 allUsuarioRoutes = require('./server/routes/user.routes');
 allRestauranteRoutes(app);
 allTipoComidaRoutes(app); 
 allMenuRoutes(app); 
 allUsuarioRoutes(app); 
 
 app.listen(port,()=>{
    console.log("Server corriendo en el puerto: ",port);
 })