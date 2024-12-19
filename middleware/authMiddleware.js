const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirigir a login si no hay sesión
    }
    next();
};

