// controllers/userController.js
const User = require('../models/User');
const { generateToken, verifyToken } = require('../utils/tokenUtils');
const Measurement = require('../models/Measurement');

exports.signup = async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const { email, password, termsAccepted, newsletter } = req.body;

        // Check if required fields are present
        if (!email || !password || termsAccepted === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new user
        const user = new User({ email, password, termsAccepted, newsletter });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({ message: 'User created successfully', user, token });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user data
exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id; // Use ID from token
        const updatedData = req.body;

        // Update user data
        const user = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Dados do usuário atualizados com sucesso', user });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro no servidor', error });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Obter todas as medições do usuário
        const measurements = await Measurement.find({ user: userId }).sort({ recordedAt: -1 });

        // Calcular estatísticas
        let averageGlycemia = null;
        let lowestGlycemia = null;
        let highestGlycemia = null;
        let weeklyAverage = null;

        if (measurements.length > 0) {
            const values = measurements.map(m => m.glycemiaValue);
            averageGlycemia = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1);
            lowestGlycemia = Math.min(...values);
            highestGlycemia = Math.max(...values);

            // Calcular média semanal
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const lastWeekMeasurements = measurements.filter(m => m.recordedAt >= oneWeekAgo);
            if (lastWeekMeasurements.length > 0) {
                const weeklyValues = lastWeekMeasurements.map(m => m.glycemiaValue);
                weeklyAverage = (weeklyValues.reduce((sum, val) => sum + val, 0) / weeklyValues.length).toFixed(1);
            }
        }

        // Última medição
        const lastMeasurement = measurements[0];

        // Preparar dados de resposta
        const responseData = {
            ...user.toObject(),
            lastGlycemia: lastMeasurement ? lastMeasurement.glycemiaValue : null,
            lastMeasurement: lastMeasurement ? lastMeasurement.recordedAt : null,
            averageGlycemia,
            lowestGlycemia,
            highestGlycemia,
            weeklyAverage,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Erro ao obter perfil do usuário:', error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};


// controllers/userController.js
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Procure o usuário pelo email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Verifique a senha
        const isMatch = await User.findOne({ password });

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Gere o token
        const token = generateToken(user._id);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.updateGlycemiaGoals = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetMin, targetMax, hypoLimit, hyperLimit } = req.body;

        // Validação básica dos campos
        if (!targetMin || !targetMax || !hypoLimit || !hyperLimit) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Validações lógicas
        if (targetMin >= targetMax) {
            return res.status(400).json({ message: 'O valor mínimo deve ser menor que o valor máximo' });
        }

        if (hypoLimit >= targetMin) {
            return res.status(400).json({ message: 'O limite de hipoglicemia deve ser menor que o valor mínimo alvo' });
        }

        if (hyperLimit <= targetMax) {
            return res.status(400).json({ message: 'O limite de hiperglicemia deve ser maior que o valor máximo alvo' });
        }

        // Atualizar as metas do usuário
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        user.glycemiaGoals = {
            targetMin,
            targetMax,
            hypoLimit,
            hyperLimit
        };

        await user.save();

        res.status(200).json({ message: 'Metas atualizadas com sucesso', glycemiaGoals: user.glycemiaGoals });
    } catch (error) {
        console.error('Erro ao atualizar metas de glicemia:', error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

// controllers/userController.js

// Função para obter as metas de glicemia
exports.getGlycemiaGoals = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('glycemiaGoals');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json(user.glycemiaGoals);
    } catch (error) {
        console.error('Erro ao obter metas de glicemia:', error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};
