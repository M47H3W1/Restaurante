const MenuController = require('../controllers/menu.controller');

module.exports = function(app) {
    app.post("/menu", MenuController.CreateMenu);
    app.get("/menu", MenuController.getAllMenus);
    app.get("/menu/:id", MenuController.getMenuById);
    app.put("/menu/:id", MenuController.updateMenu);
    app.delete("/menu/:id", MenuController.deleteMenu);
    app.get("/menu/restaurante/:id", MenuController.getMenuByRestaurante);
    app.get("/api/v1/restaurantesByTipoC/:idTipoComida", MenuController.getRestaurantesByTipoComida);
}