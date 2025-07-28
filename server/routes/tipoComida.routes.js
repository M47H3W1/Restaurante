const TipoComidaController = require('../controllers/tipoComida.controller');

module.exports = function(app) {
    app.post("/tipo", TipoComidaController.CreateTipoComida);
    app.get("/tipo", TipoComidaController.getAllTipoComidas);
    app.get("/tipo/:id", TipoComidaController.getTipoComida);
    app.put("/tipo/:id", TipoComidaController.updateTipoComida);
    app.delete("/tipo/:id", TipoComidaController.deleteTipoComida);

    
}