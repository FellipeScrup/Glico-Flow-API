// routes/userRoutes.js
const express = require('express');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
const { signup, updateUser, signin, getUserProfile, updateGlycemiaGoals, getGlycemiaGoals } = require('../controllers/userController');

router.post('/signup', signup);
router.put('/update', protect, updateUser);
router.post('/signin', signin);
router.get('/profile', protect, getUserProfile); // Nova rota para obter o perfil do usuário
router.post('/goals', protect, updateGlycemiaGoals);
router.get('/goals', protect, getGlycemiaGoals);
module.exports = router;
