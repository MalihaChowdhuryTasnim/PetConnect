const express = require("express");
const Pet = require("../models/Pet");

const router = express.Router();

// Create a new pet
router.post("/post-pet", async (req, res) => {

    try {

        const {
            name,
            category,
            breed,
            age,
            gender,
            vaccinated,
            location,
            contact,
            description
        } = req.body;

        const pet = new Pet({
            name,
            category,
            breed,
            age,
            gender,
            vaccinated,
            location,
            contact,
            description
        });

        await pet.save();

        res.status(201).json({
            message: "Pet posted successfully!"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;