const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    });
}

exports.validarRegistro = (req, res, next) => {
    
    //Sanitizar los campos
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();
    
    //Validar
    req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'Ingresa un email válido').isEmail();
    req.checkBody('password', 'El password no puede ir vacío').notEmpty();
    req.checkBody('confirmar', 'Confirma tu password').notEmpty();
    req.checkBody('confirmar', 'El password no coincide').equals(req.body.password);
    
    const errores = req.validationErrors();
    
    if (errores) {
        //si no hay errores
        req.flash('error', errores.map(error => error.msg));
        
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash(), 
        });
        return; //detener la ejecución
    }

    //Si toda la validación es correcta
    next();
}

exports.crearUsuario = async (req, res, next) => {
    //Crear el usuario
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');        
    }

}

//Formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devJobs'
    });
}

//Form editar el perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.nombre
    }); 
}

//Guardar cambios en editar perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);
    
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;

    if (req.body.password) {
        usuario.password = req.body.password
    }

    await usuario.save();

    req.flash('correcto', "Los cambios fueron guardados correctamente");
    //redireccionar
    res.redirect('/administracion');
}

//Sanitizar formulario de editar perfil
exports.validarPerfil = (req, res, next) => {
    //Sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if (req.body.password) {
        req.sanitizeBody('password').escape();
    }
    //Validar
    req.checkBody('nombre', 'El nombre no puede ir vacío').notEmpty();
    req.checkBody('email', 'El email no puede ir vacío').notEmpty();

    const errores = req.validationErrors();

    if (errores) {
        req.flash('error', errores.map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en devJobs',
            usuario: req.user.toObject(),
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        }); 
        
    }

    next();
}