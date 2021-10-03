const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //Crear vacantes
    router.get('/vacantes/nueva',
        authController.verificarUsuario, 
        vacanteController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva', 
        authController.verificarUsuario,
        vacanteController.agregarVacante
    );

    //Mostrar vacante (singular)
    router.get('/vacantes/:url', vacanteController.mostrarVacante);

    //Editar vacante
    router.get('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacanteController.formEditarVacante
    );
    router.post('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacanteController.editarVacante
    );

    //Crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', 
        usuariosController.validarRegistro,
        usuariosController.crearUsuario
    );

    //Autenticar usuario
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Panel de Administración
    router.get('/administracion',
        authController.verificarUsuario, 
        authController.mostrarPanel
    );

    return router;
}