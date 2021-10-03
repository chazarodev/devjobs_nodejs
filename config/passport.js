const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

passport.use(new LocalStrategy({
    //Indicar los campos con los cuales realizamos la autenticación
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    const usuario = await Usuarios.findOne({email});

    //Si no hay usuario
    if (!usuario) return done(null, false, {
        message: 'Usuario no existente'
    });

    //Si el usuario existe, verificar su password
    const verificarPass = usuario.compararPassword(password);
    if (!verificarPass) return done(null, false, {
        message: 'Datos incorrectos'
    });

    //Usuario y password correctos
    return done(null, usuario);

}));

passport.serializeUser((usuario, done) => done(null, usuario._id));
passport.deserializeUser(async (id, done) => {
    const usuario = await Usuarios.findById(id).exec();
    return done(null, usuario);
});

module.exports = passport;