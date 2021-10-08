const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

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

// Formulario para reiniciar el password
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer-password', {
        nombrePagina: 'Reestablece tu password',
        tagline: 'Si ya tienes un cuenta pero no recuerdas tu password, coloca tu email'
    });
}

// Generar el token en la tabla del usuario
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({email: req.body.email});
    
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // El usuario existe, generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 36000

    //Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    //Enviar notificacion por email
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset'
    });

    req.flash('correcto', 'El correo para reestablecer tu password se envió a tu bandeja')
    res.redirect('/iniciar-sesion');
}

//Validar Token y usuario
exports.reestablecerPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });
    if (!usuario) {
        req.flash('error', 'El formulario ya no es válido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Token valido, mostrar formulario
    res.render('nuevo-password', {
        nombrePagina: 'Nuevo password'
    })
}