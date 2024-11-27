const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, reportController.generateReport);

module.exports = router; 