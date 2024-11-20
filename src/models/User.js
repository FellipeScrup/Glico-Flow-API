// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    termsAccepted: {
        type: Boolean,
        required: true
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    age: {
        type: Number
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    diabetesType: {
        type: String,
        enum: ['type1', 'type2', 'pre', 'gestational']
    },
    treatmentMethod: {
        type: String,
        enum: ['pen_syringe', 'pump', 'no_insulin']
    },
    medication: {
        type: String,
        enum: ['sim', 'nao']
    },
    glycemiaUnit: {
        type: String,
        enum: ['mg/dL', 'mmol/L']
    },
    carbUnit: {
        type: String,
        enum: ['g', 'ex']
    },
    glycemiaValue: {
        type: Number,
        min: 20, 
        max: 900 
    },
    glycemiaRecordedAt: {
        type: Date
    },
    meterType: {
        type: String
    },
    customMeter: {
        type: String
    },
    sensorType: {
        type: String
    },
    customSensor: {
        type: String
    },
    glycemiaGoals: {
        targetMin: { type: Number, default: 70 },
        targetMax: { type: Number, default: 180 },
        hypoLimit: { type: Number, default: 60 },
        hyperLimit: { type: Number, default: 200 },
    },
});

module.exports = mongoose.model('User', userSchema);
