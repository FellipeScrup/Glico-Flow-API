// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const measurementRoutes = require('./src/routes/measurementRoutes');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://glico-flow.vercel.app'], // Lista de origens permitidas
    credentials: true
}));

app.use(express.json());


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
