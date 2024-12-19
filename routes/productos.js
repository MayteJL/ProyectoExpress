const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');


// Middleware para verificar sesión
const verificarSesion = (req, res, next) => {
    if (!req.app.locals.isAuthenticated) {
        return res.redirect('/auth/login');  // Redirige si no está autenticado
    }
    next();
};

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
    // Aquí debes agregar la lógica para obtener los productos de la base de datos
    res.send('Lista de productos'); // Solo como ejemplo
});

// Ruta para agregar un nuevo producto
router.post('/nuevo', (req, res) => {
    const nuevoProducto = req.body;
    res.send('Producto registrado: ' + nuevoProducto.nombre);
});

// GET: Obtener todos los productos (protegido)
router.get('/', verificarSesion, async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('producto', { productos });
    } catch (error) {
        res.status(500).send('Error al obtener los productos: ' + error.message);
    }
});

// GET: Obtener un solo producto por ID
router.get('/:id', verificarSesion, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send('Producto no encontrado');
        res.render('indv', { producto });
    } catch (error) {
        res.status(500).send('Error al obtener el producto: ' + error.message);
    }
});

// GET: Página para registrar un nuevo producto
router.get('/register', verificarSesion, (req, res) => {
    res.render('register-producto');  // Renderiza la vista del formulario de registro
});


// POST: Crear un nuevo producto
router.post('/', verificarSesion, async (req, res) => {
    try {
        const nuevoProducto = new Producto({
            id: req.body.id,
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            precio: req.body.precio
        });
        await nuevoProducto.save();
        res.redirect('/productos');  // Redirige a la lista de productos después de crear el nuevo producto
    } catch (error) {
        res.status(500).send('Error al crear el producto: ' + error.message);
    }
});


// PUT: Actualizar un producto
router.put('/:id', verificarSesion, async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!productoActualizado) return res.status(404).send('Producto no encontrado');
        res.redirect('/productos');
    } catch (error) {
        res.status(500).send('Error al actualizar el producto: ' + error.message);
    }
});

// DELETE: Eliminar un producto
router.delete('/:id', verificarSesion, async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) return res.status(404).send('Producto no encontrado');
        res.redirect('/productos');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto: ' + error.message);
    }
});

module.exports = router;
