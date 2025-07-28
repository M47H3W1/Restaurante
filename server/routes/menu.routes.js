const MenuController = require('../controllers/menu.controller');
const { protect } = require('../middleware/authentication_mw');

module.exports = function(app) {
    // Rutas protegidas - requieren autenticación
    app.post("/menu", protect, MenuController.CreateMenu);
    app.put("/menu/:id", protect, MenuController.updateMenu);
    app.delete("/menu/:id", protect, MenuController.deleteMenu);
    
    // Rutas públicas - no requieren autenticación
    app.get("/menu", MenuController.getAllMenus);
    app.get("/menu/:id", MenuController.getMenuById);
    app.get("/menu/restaurante/:id", MenuController.getMenuByRestaurante);
    app.get("/api/v1/restaurantesByTipoC/:idTipoComida", MenuController.getRestaurantesByTipoComida);
}