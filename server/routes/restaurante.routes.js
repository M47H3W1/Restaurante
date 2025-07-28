const RestauranteController = require('../controllers/restaurante.controller');
const { protect } = require('../middleware/authentication_mw');
//Que es una ruta de express?
//Cual es la estructura?
//una ruta, un controlador, un metodo HTTP (GET; POST; PUT; DELETE)

//En terminos generales, como un endpoint, un path (ruta), está el controlador, 
//Aqui también podríamos tener el manejo de las promesas.
module.exports = function(app) {
    app.post("/restaurantes", protect, RestauranteController.CreateRestaurante);
    app.get("/restaurantes", RestauranteController.getAllRestaurantes);
    app.get("/restaurantes/:id", RestauranteController.getRestaurante);
    app.put("/restaurantes/:id", protect, RestauranteController.updateRestaurante);
    app.delete("/restaurantes/:id", protect, RestauranteController.deleteRestaurante);
    app.get("/restaurantes-reputacion", protect, RestauranteController.getRestaurantesByReputacion); // Ruta
    //app.get("/restaurantes/reputacion/:min/:max", RestauranteController.getRestaurantesByReputacionParms);
}