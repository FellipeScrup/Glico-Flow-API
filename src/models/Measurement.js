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

measurementSchema.index({ user: 1, recordedAt: -1 });
measurementSchema.index({ glycemiaValue: 1 });

module.exports = mongoose.model('Measurement', measurementSchema);
