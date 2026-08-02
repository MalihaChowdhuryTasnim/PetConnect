const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    breed: {
        type: String,
        required: true
    },

    age: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    vaccinated: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Pet", petSchema);