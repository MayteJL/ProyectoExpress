const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('Usuario', usuarioSchema);