// routes/measurementRoutes.js

const express = require('express');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
const { addMeasurement, getMeasurements } = require('../controllers/measurementController');

router.post('/', protect, addMeasurement);
router.get('/', protect, getMeasurements); // Nova rota GET

module.exports = router;
