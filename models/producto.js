const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    ID: { type: Number, required: true },
    Nombre: { type: String, required: true },
    Tipo: { type: String, required: true },
    Precio: { type: Number, required: true },
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
