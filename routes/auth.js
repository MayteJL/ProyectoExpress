const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// GET: Página de login
router.get('/login', (req, res) => {
    res.render('login');  // Renderiza la página de login
});

// POST: Iniciar sesión
router.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const user = await Usuario.findOne({ usuario });

        if (!user) {
            return res.status(401).send('Credenciales inválidas');
        }

        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const esCorrecta = await bcrypt.compare(contrasena, user.contrasena);

        if (!esCorrecta) {
            return res.status(401).send('Credenciales inválidas');
        }

        // Marca al usuario como autenticado y guarda su ID
        req.app.locals.isAuthenticated = true;
        req.app.locals.usuarioId = user._id;  // Almacena el ID del usuario autenticado

        res.redirect('/productos');  // Redirige a la página de productos
    } catch (error) {
        res.status(500).send('Error al iniciar sesión: ' + error.message);
    }
});


// POST: Cerrar sesión
router.post('/logout', (req, res) => {
    req.app.locals.isAuthenticated = false;  // Marca la sesión como no autenticada
    req.app.locals.usuarioId = null;  // Elimina el ID del usuario
    res.redirect('/auth/login');  // Redirige al login
});

// GET: Página de registro
router.get('/register', (req, res) => {
    res.render('register');  // Renderiza la página de registro
});

// POST: Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ usuario });

        if (usuarioExistente) {
            return res.status(400).send('El usuario ya existe');
        }

        // Encriptar la contraseña antes de guardarla
        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = new Usuario({ usuario, contrasena: contrasenaEncriptada });
        await nuevoUsuario.save();

        res.redirect('/auth/login');  // Redirige a la página de login después de registrar
    } catch (error) {
        res.status(500).send('Error al registrar el usuario: ' + error.message);
    }
});

module.exports = router;
