const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({

    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

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
    },

image: {
    type: String,
    required: false
},

adoptionStatus: {
    type: String,
    enum: ["Available", "Reserved", "Adopted"],
    default: "Available"
}

}, {
    timestamps: true
});

module.exports = mongoose.model("Pet", petSchema);