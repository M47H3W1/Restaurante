 /*
 const express = require('express');
 const app = express();
 const port = 8000;
 require('./server/config/mongoose.config.js'); // Importar la configuración de mongoose
 //app.get('/', function (_, res) {
 //res.send('¡Hola Mundo!');
 //});
 //El server no se reinicia de forma automática, para evitar eso se utiliza nodemon
 //El request se utiliza para recibir datos del cliente
 //Ambos son objetos: Solicitud - Respuesta (Conjunto de métodos para responder al cliente)
const restaurantes = [
    { id: 1, nombre: "Restaurante San José", direccion: "Ladrón de Guevara E11-253" },
    { id: 2, nombre: "Restaurante El Buen Sabor", direccion: "Av. Amazonas N34-123" },
    { id: 3, nombre: "Restaurante La Esquina", direccion: "Calle 10 y Av. 6 de Diciembre" }
    ]

//Middleware para parsear el cuerpo de la solicitud
app.use(express.json()); // Para parsear JSON en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios

const allRestauranteRoutes = require('./server/routes/restaurante.routes');
allRestauranteRoutes(app); // Registrar las rutas de restaurantes

app.get("/restaurantes", (request, response)=> {
    //Se envia un json, abajo se enviaba en texto plano
    //response.json({nombre: "Restaurante San José", direccion: "Ladrón de Guevara E11-253"})
    //response.status(404).json({"error": "No se encontró el restaurante solicitado"});
    //response.send("¡Hola Mundo!");
    //response.status(200).send("¡Hola Mundo!");

    //Enviar la lista de restaurantes
    response.json(restaurantes);
    });

//Método para obtener el item del restaurante
app.get("/restaurantes/:id", (request, response)=> {
    if(request.params.id>=0 && request.params.id<restaurantes.length) {
        response.json(restaurantes[request.params.id]);        
    }else{
        response.status(404).json({"error": "No se encontró el restaurante solicitado"});
    }
});
//Se asume que el id es el indice del restaurante en el array
app.put("/restaurantes/:id", (request, response)=> {
    const id = parseInt(request.params.id);
    if(id >= 0 && id < restaurantes.length) {
        //Actualizar el restaurante
        restaurantes[id] = request.body;
        response.json({status: "ok", message: "Restaurante actualizado correctamente"});
    }
    response.status(404).json({"error": "No se encontró el restaurante solicitado"});
});

//app.post("/restaurantes/:id/:name", (request, res)=> 
app.post("/restaurantes/", (request, res)=> {
    restaurantes.push(request.body);
    res.json({status:"ok"})

    //console.log("Parámetros:", request.params);
    //Obtener parametros de consulta
    //console.log("Parámetros query:", request.query);
    //console.log("Body:", request.body);
    //res.status(201).json({mensaje: "Restaurante recibido correctamente"});
});

app.delete("/restaurantes/:id", (request, response)=> {
    const id = parseInt(request.params.id);
    if(id >= 0 && id < restaurantes.length) {
        //Eliminar el restaurante
        restaurantes.splice(id, 1);
        response.json({status: "ok"});
    }else{
        response.status(404).json({"error": "No se encontró el restaurante solicitado"});    //Si no se encuentra el restaurante, se devuelve un error 404
    }
    
});

 app.listen(port, function () {
 console.log('server.js escuchando en el siguiente puerto', port);
 });
 */

 //const cors = require('cors');
 const express = require('express')
 const cors = require('cors');
 const app = express();
 const port = 8000;
 ///require('./server/config/mongoose.config')
require('./server/config/sequelize.config.js'); // Importar la configuración de Sequelize
// app.use(cors()); // Habilitar CORS para todas las rutas
 app.use(cors());
 app.use(express.json()); // Middleware para parsear JSON en el cuerpo de la solicitud
 app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
 //const allRestauranteRoutes = require('./server/routes/restaurante.routes');
 const allRestauranteRoutes = require('./server/routes/restaurante.routes');
 const allTipoComidaRoutes = require('./server/routes/tipoComida.routes');
 const allMenuRoutes = require('./server/routes/menu.routes');
 allRestauranteRoutes(app);
 allTipoComidaRoutes(app); 
 allMenuRoutes(app); 
 app.listen(port,()=>{
    console.log("Server corriendo en el puerto: ",port);
 })