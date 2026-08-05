const express = require("express");
const multer = require("multer");
const path = require("path");

const Pet = require("../models/Pet");

const router = express.Router();


// Multer storage settings
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({ storage: storage });


// Create a new pet
router.post(
    "/post-pet",
    upload.single("image"),
    async (req, res) => {

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
                description,

                image: req.file
                    ? req.file.filename
                    : ""

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

    }
);


// Get all pets
router.get("/pets", async (req, res) => {

    try {

        const pets = await Pet.find();

        res.status(200).json(pets);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


module.exports = router;