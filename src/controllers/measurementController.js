// controllers/measurementController.js

const Measurement = require('../models/Measurement');

exports.addMeasurement = async (req, res) => {
    try {
        const userId = req.user.id;
        const { glycemiaValue, recordedAt } = req.body;

        if (!glycemiaValue) {
            return res.status(400).json({ message: 'Valor de glicemia é obrigatório' });
        }

        const measurement = new Measurement({
            user: userId,
            glycemiaValue,
            recordedAt: recordedAt || new Date(),
        });

        await measurement.save();

        res.status(201).json({ message: 'Medição adicionada com sucesso', measurement });
    } catch (error) {
        console.error('Erro ao adicionar medição:', error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

// Nova função para obter medições
exports.getMeasurements = async (req, res) => {
    try {
        const userId = req.user.id;
        const measurements = await Measurement.find({ user: userId }).sort({ recordedAt: -1 });

        res.status(200).json(measurements);
    } catch (error) {
        console.error('Erro ao obter medições:', error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};