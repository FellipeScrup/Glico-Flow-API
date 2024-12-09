// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const measurementRoutes = require('./src/routes/measurementRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://glico-flow.vercel.app',
        'http://localhost:5000',
        'https://glico-flow-fellipescrups-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log('Requisição recebida:', {
        método: req.method,
        url: req.url,
        headers: req.headers
    });
    next();
});

app.use('/api/measurements', measurementRoutes);

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requisições por IP
});

app.use('/api/', limiter);

// Comprimir apenas respostas maiores que 1KB
app.use(compression({
    level: 6, // nível de compressão balanceado
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
