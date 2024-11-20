// models/Measurement.js

const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    glycemiaValue: {
        type: Number,
        required: true,
        min: 20,
        max: 600,
    },
    recordedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Measurement', measurementSchema);
