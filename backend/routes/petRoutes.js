const express = require("express");
const multer = require("multer");
const path = require("path");

const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");
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

        // Public listing: never expose owner contact info here
        const pets = await Pet.find().select("-contact");

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
// GET SINGLE PET BY ID
// ===============================

router.get("/pets/:id", async (req, res) => {

    try {

        // Get pet AND owner's name.
        // Public route: never expose owner contact info here —
        // it's only surfaced via /my-adoption-requests once
        // the requester's request has been Accepted.
        const pet = await Pet.findById(req.params.id)
            .select("-contact")
            .populate("owner", "name");


        if (!pet) {

            return res.status(404).json({

                message: "Pet not found!"

            });

        }


        res.status(200).json(pet);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

});


// ===============================
// MARK PET AS ADOPTED
// ===============================
// Owner-only. Finalizes the adoption:
// pet stays in the database (so accepted
// requests keep pointing to a real pet),
// its adoptionStatus becomes "Adopted",
// and it stops appearing as available.
// Only a Reserved pet can be marked Adopted,
// since that means an accepted request exists.
// ===============================

router.patch(
    "/pets/:id/adopt",
    protect,
    async (req, res) => {

    try {

        const pet =
            await Pet.findById(req.params.id);


        if (!pet) {

            return res.status(404).json({

                message: "Pet not found!"

            });

        }


        const userId =
            req.user._id || req.user.id;


        // Only the pet's owner can mark it adopted
        if (
            !pet.owner ||
            pet.owner.toString() !== userId.toString()
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to update this pet."

            });

        }


        // Pet must currently be Reserved
        // (i.e. an accepted request exists)
        if (pet.adoptionStatus !== "Reserved") {

            return res.status(400).json({

                message:
                    "Only a reserved pet with an accepted request can be marked as adopted."

            });

        }


        pet.adoptionStatus = "Adopted";

        await pet.save();


        res.status(200).json({

            message:
                "Pet marked as adopted successfully!"

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// ===============================
// DELETE PET POST
// ===============================
// Owner-only. Permanently removes the pet
// post, at any adoptionStatus, and cleans up
// every AdoptionRequest tied to it so no
// broken/orphaned requests remain.
// ===============================

router.delete(
    "/pets/:id",
    protect,
    async (req, res) => {

    try {

        const pet =
            await Pet.findById(req.params.id);


        if (!pet) {

            return res.status(404).json({

                message: "Pet not found!"

            });

        }


        const userId =
            req.user._id || req.user.id;


        // Only the pet's owner can delete this post
        if (
            !pet.owner ||
            pet.owner.toString() !== userId.toString()
        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to delete this pet."

            });

        }


        // Clean up any adoption requests tied to
        // this pet so no orphaned records remain
        await AdoptionRequest.deleteMany({
            pet: pet._id
        });


        await Pet.findByIdAndDelete(req.params.id);


        res.status(200).json({

            message:
                "Pet post deleted successfully!"

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


module.exports = router;