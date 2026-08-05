const express = require("express");
const multer = require("multer");
const path = require("path");

const Pet = require("../models/Pet");
const protect = require("../authMiddleware");

const router = express.Router();


// ===============================
// MULTER STORAGE
// ===============================

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


// ===============================
// CREATE A NEW PET
// ===============================

router.post(
    "/post-pet",
    protect,
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

                // Logged-in user's ID
                owner: req.user.id,

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

            console.error(error);

            res.status(500).json({

                message: error.message

            });

        }

    }
);


// ===============================
// GET ALL PETS
// ===============================

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

// ===============================
// GET MY PETS
// ===============================

router.get("/my-pets", protect, async (req, res) => {

    try {

        const pets = await Pet.find({
            owner: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json(pets);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

});
// ===============================
// DELETE / MARK PET AS ADOPTED
// ===============================

router.delete("/pets/:id", async (req, res) => {

    try {

        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                message: "Pet not found!"
            });
        }

        await Pet.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Pet marked as adopted successfully!"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;