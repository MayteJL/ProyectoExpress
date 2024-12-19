const express = require('express');
const methodOverride = require('method-override');
const productoRoutes = require('./routes/productos'); 
const connectDB = require('./config/db'); // Asegúrate de que esté importado desde la ruta correcta
const Producto = require('./models/producto');
const path = require('path');
const authRouter = require('./routes/auth'); // Asegúrate de tener la ruta correcta
const app = express();

// Conectar a la base de datos
connectDB();

app.set('views', './views');

app.use('/productos', productoRoutes);

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que la carpeta 'views' esté configurada correctamente

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Esto permite usar PUT y DELETE en formularios
app.use(express.urlencoded({ extended: true })); // Para poder leer los datos del formulario
app.use('/auth', authRouter); 

// Middleware para verificar sesión
const verificarSesion = (req, res, next) => {
    if (!req.app.locals.isAuthenticated) {
        return res.redirect('/auth/login');  // Redirige si no está autenticado
    }
    next();
};

// Configuración de rutas
const router = express.Router();
// Ruta POST para procesar el login
router.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;
    // Lógica para verificar el usuario y la contraseña
    // Si es correcto, redirige a la página principal o dashboard
    res.redirect('/productos');
});

module.exports = router;

// Ruta para mostrar la página de inicio de sesión al acceder a /
app.get('/', (req, res) => {
    res.render('login'); // Renderiza la vista 'login.ejs'
});



// GET: Página para registrar un nuevo producto
router.get('/productos/register', verificarSesion, (req, res) => {
    res.render('register-producto');  // Renderiza la vista del formulario de registro
});


// POST: Crear un nuevo producto
router.post('/productos/nuevo', async (req, res) => {
    try {
        console.log('Datos recibidos para nuevo producto:', req.body); // Verificar los datos recibidos

        const nuevoProducto = new Producto({
            ID: req.body.ID,
            Nombre: req.body.Nombre,
            Tipo: req.body.Tipo,
            Precio: req.body.Precio,
        });

        const productoGuardado = await nuevoProducto.save();
        console.log('Producto guardado:', productoGuardado);

        res.redirect('/productos');
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(400).json({
            error: 'Error al crear el producto',
            detalles: error.message,
        });
    }
});


// PUT: Actualizar un producto
router.put('/productos/:id', verificarSesion, async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!productoActualizado) return res.status(404).send('Producto no encontrado');
        res.redirect('/productos');
    } catch (error) {
        res.status(500).send('Error al actualizar el producto: ' + error.message);
    }
});

// DELETE: Eliminar un producto
router.delete('/productos/:id', verificarSesion, async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) return res.status(404).send('Producto no encontrado');
        res.redirect('/productos');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto: ' + error.message);
    }
});

// Usar el router en la ruta /productos
app.use('/productos', router);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);

});