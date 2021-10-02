const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //Crear vacantes
    router.get('/vacantes/nueva', vacanteController.formularioNuevaVacante);
    router.post('/vacantes/nueva', vacanteController.agregarVacante);

    //Mostrar vacante (singular)
    router.get('/vacantes/:url', vacanteController.mostrarVacante);

    //Editar vacante
    router.get('/vacantes/editar/:url', vacanteController.formEditarVacante);
    router.post('/vacantes/editar/:url', vacanteController.editarVacante);

    return router;
}