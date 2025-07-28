const TipoComidaController = require('../controllers/tipoComida.controller');
const { protect } = require('../middleware/authentication_mw');

module.exports = function(app) {
    // Rutas protegidas - requieren autenticación
    app.post("/tipo", protect, TipoComidaController.CreateTipoComida);
    app.put("/tipo/:id", protect, TipoComidaController.updateTipoComida);
    app.delete("/tipo/:id", protect, TipoComidaController.deleteTipoComida);
    
    // Rutas públicas - no requieren autenticación
    app.get("/tipo", TipoComidaController.getAllTipoComidas);
    app.get("/tipo/:id", TipoComidaController.getTipoComida);
}