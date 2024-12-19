const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const authMiddleware = require('../middleware/authMiddleware'); 

// Verificar que el middleware express.json() está configurado
router.use(express.json());
router.use(authMiddleware); // Aplicar el middleware en todas las rutas



router.get('/producto/crud', async (req, res) => {
    try {
        const productos = await Producto.find({ userId: req.session.user }); // Filtrar por usuario
        res.render('crudProductos', { productos });
    } catch (error) {
        console.error('Error al cargar la interfaz CRUD:', error);
        res.status(500).send('¡Algo salió mal al cargar la interfaz CRUD!');
    }
});

// Middleware para verificar el body en las peticiones POST y PUT
const verificarBody = (req, res, next) => {
    console.log('Body recibido:', req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            error: 'Body vacío o no válido',
            bodyRecibido: req.body 
        });
    }
    next();
};


// Obtener todos los productos y renderizar la tabla de productos
router.get('/producto', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos

        console.log('Productos encontrados:', productos); // Verifica qué contiene `productos`

        if (!productos || productos.length === 0) {
            return res.render('productos', { productos: [] }); // Renderizar la vista con lista vacía
        }

        res.render('productos', { productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('¡Algo salió mal!');
    }
});



// Obtener detalles de un producto específico
router.get('/producto/:id', async (req, res) => {
    try {
        const id = req.params.id; // Obtener el ID del producto desde la URL
        const producto = await Producto.findById(id); // Buscar el producto en la base de datos

        if (!producto) {
            return res.status(404).send('Producto no encontrado'); // Manejar el caso en que no se encuentra el producto
        }

        // Renderizar la vista de detalle del producto con los datos del producto
        res.render('detalleProducto', { producto });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('¡Algo salió mal!');
    }
});

// Obtener todos los productos de la tienda (READ - formato JSON)
router.get('/producto/json', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error de servidor' });
    }
});

// Crear un nuevo producto (CREATE)
// Crear un nuevo producto (CREATE)
// Crear un nuevo producto (POST)
router.post('/producto/nuevo', async (req, res) => {
    try {
        const nuevoProducto = new Producto({
            ID: req.body.ID, // Asegurarse de que se pasa el ID
            Nombre: req.body.Nombre, // Nombre del producto
            Tipo: req.body.Tipo, // Tipo del producto
            Precio: req.body.Precio, // Precio del producto
        });

        const productoGuardado = await nuevoProducto.save();
        console.log('Producto guardado:', productoGuardado);

        // Redirigir o enviar respuesta de éxito
        res.redirect('/producto'); // O redirigir a otra vista si lo prefieres
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(400).json({
            error: 'Error al crear el producto',
            detalles: error.message,
        });
    }
});


// Actualizar un producto (UPDATE)
router.put('/producto/:id', verificarBody, async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            {
                ID: req.body.ID,
                Nombre: req.body.Nombre,
                Tipo: req.body.Tipo,
                Precio: req.body.Precio
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(productoActualizado);
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(400).json({ 
            error: 'Error al actualizar el producto',
            detalles: error.message
        });
    }
});

// Eliminar un producto (DELETE)
router.delete('/producto/:id', async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;