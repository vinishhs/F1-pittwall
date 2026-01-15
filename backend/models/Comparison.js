const mongoose = require('mongoose');

const ComparisonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    driver1: {
        type: String,
        required: true
    },
    driver2: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comparison', ComparisonSchema);
