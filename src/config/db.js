// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1);
    }
};

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado com sucesso');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro na conexão com MongoDB:', err);
});

module.exports = connectDB;
