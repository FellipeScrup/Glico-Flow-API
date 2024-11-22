// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const measurementRoutes = require('./src/routes/measurementRoutes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://glico-flow.vercel.app',
        'https://glico-flow-api.onrender.com',
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
