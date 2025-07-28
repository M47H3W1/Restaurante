const RestauranteController = require('../controllers/restaurante.controller');
//Que es una ruta de express?
//Cual es la estructura?
//una ruta, un controlador, un metodo HTTP (GET; POST; PUT; DELETE)

//En terminos generales, como un endpoint, un path (ruta), está el controlador, 
//Aqui también podríamos tener el manejo de las promesas.
module.exports = function(app) {
    app.post("/restaurantes", RestauranteController.CreateRestaurante);
    app.get("/restaurantes", RestauranteController.getAllRestaurantes);
    app.get("/restaurantes/:id", RestauranteController.getRestaurante);
    app.put("/restaurantes/:id", RestauranteController.updateRestaurante);
    app.delete("/restaurantes/:id", RestauranteController.deleteRestaurante);
    app.get("/restaurantes-reputacion", RestauranteController.getRestaurantesByReputacion); // Ruta
    //app.get("/restaurantes/reputacion/:min/:max", RestauranteController.getRestaurantesByReputacionParms);
}