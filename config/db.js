const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://rjmaytejl:admin@cluster0.w2aii.mongodb.net/Cafeteria';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('CONECTADO A MONGODB');
    } catch (error) {
        console.error('ERROR CONECTANDO A MONGODB: ', error);
        process.exit(1); // Termina la aplicación si no se puede conectar a la base de datos
    }
};

module.exports = connectDB;
