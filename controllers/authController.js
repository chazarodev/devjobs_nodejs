const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ingresa tus datos para iniciar sesión'
});

//Revisar si el usuario está autenticado
exports.verificarUsuario = (req, res, next) => {

    //Revisar el usuario
    if (req.isAuthenticated()) {
        return next(); //usuario autenticado, envías al siguiente middleware
    }

    //Usuario no autenticado, redireccionar
    res.redirect('/iniciar-sesion')
}

exports.mostrarPanel = async (req,res) => {

    //Consultar el usuario autenticado
    const vacantes = await Vacante.find({autor: req.user._id}).lean(); 

    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y administra tus vacantes desde aquí',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout();

    req.flash('correcto', 'Tu sesión se cerró correctamente');
    return res.redirect('/iniciar-sesion');
}