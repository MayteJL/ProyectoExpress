const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

// Middleware para verificar sesión
const verificarSesion = (req, res, next) => {
    if (!req.app.locals.isAuthenticated) {
        return res.redirect('/auth/login'); // Redirige si no está autenticado
    }
    next();
};

// Ruta para obtener todos los productos (protegido)
router.get('/', verificarSesion, async (req, res) => {
    try {
        const productos = await Producto.find(); // Consulta todos los productos
        res.render('producto', { productos }); // Renderiza la vista producto.ejs
    } catch (error) {
        res.status(500).send('Error al obtener los productos: ' + error.message);
    }
});

// Ruta para registrar un nuevo producto (GET: formulario)
router.get('/register', verificarSesion, (req, res) => {
    res.render('register-producto'); // Renderiza la vista del formulario de registro
});

// Ruta para agregar un nuevo producto (POST)
router.post('/', verificarSesion, async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.redirect('/productos'); // Redirige a la lista de productos después de crear uno nuevo
    } catch (error) {
        res.status(500).send('Error al crear el producto: ' + error.message);
    }
});


// Ruta para obtener un solo producto por ID (GET)
router.get('/:id', verificarSesion, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send('Producto no encontrado');
        res.render('indv', { producto }); // Renderiza la vista individual del producto
    } catch (error) {
        res.status(500).send('Error al obtener el producto: ' + error.message);
    }
});

// Ruta para actualizar un producto (POST: acción de edición)
router.post('/editar/:id', verificarSesion, async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                tipo: req.body.tipo,
                precio: req.body.precio,
            },
            { new: true }
        );
        if (!productoActualizado) return res.status(404).send('Producto no encontrado');
        res.redirect('/productos'); // Redirige a la lista de productos después de la edición
    } catch (error) {
        res.status(500).send('Error al actualizar el producto: ' + error.message);
    }
});

// Ruta para eliminar un producto (POST: acción de eliminación)
router.post('/eliminar/:id', verificarSesion, async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) return res.status(404).send('Producto no encontrado');
        res.redirect('/productos'); // Redirige a la lista de productos después de eliminar
    } catch (error) {
        res.status(500).send('Error al eliminar el producto: ' + error.message);
    }
});

module.exports = router;
