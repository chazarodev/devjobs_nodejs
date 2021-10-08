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
        vacanteController.validarVacante,
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
        vacanteController.validarVacante,
        vacanteController.editarVacante
    );

    //Eliminar vacantes
    router.delete('/vacantes/eliminar/:id', 
        authController.verificarUsuario,
        vacanteController.eliminarVacante
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
    //Cerrar sesión
    router.get('/cerrar-sesion',
        authController.verificarUsuario,
        authController.cerrarSesion
    );

    //Resetear password(emails)
    router.get('/reestablecer-password', authController.formReestablecerPassword);
    router.post('/reestablecer-password', authController.enviarToken);

    // Resetear password (almacenar en la BD)
    router.get('/reestablecer-password/:token', authController.reestablecerPassword);

    //Panel de Administración
    router.get('/administracion',
        authController.verificarUsuario, 
        authController.mostrarPanel
    );

    //Editar perfil
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil

    );
    router.post('/editar-perfil', 
        authController.verificarUsuario,
        // usuariosController.validarPerfil,
        usuariosController.subirImagen,
        usuariosController.editarPerfil
    );

    //Recibir mensajes de candidatos
    router.post('/vacantes/:url',
        vacanteController.subirCV,
        vacanteController.contactar
    );

    //Muestra los candidatos por vacante
    router.get('/candidatos/:id',
        authController.verificarUsuario,
        vacanteController.mostrarCandidatos
    );

    return router;
}