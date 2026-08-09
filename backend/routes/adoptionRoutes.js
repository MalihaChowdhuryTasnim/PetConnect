const express = require("express");

const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const protect = require("../authMiddleware");

const router = express.Router();


// =====================================
// SEND ADOPTION REQUEST
// =====================================

router.post("/adoption-request", protect, async (req, res) => {

    try {

        const { petId, message } = req.body;


        // Check Pet ID
        if (!petId) {

            return res.status(400).json({
                message: "Pet ID is required."
            });

        }


        // Check message
        if (!message || !message.trim()) {

            return res.status(400).json({
                message: "Please write a message."
            });

        }


        // =====================================
        // GET LOGGED-IN USER ID
        // =====================================

        const userId = req.user._id || req.user.id;


        if (!userId) {

            return res.status(401).json({
                message: "User authentication failed."
            });

        }


        // =====================================
        // FIND PET
        // =====================================

        const pet = await Pet.findById(petId);


        if (!pet) {

            return res.status(404).json({
                message: "Pet not found."
            });

        }


        // =====================================
        // CHECK PET OWNER
        // =====================================

        if (
            pet.owner &&
            pet.owner.toString() === userId.toString()
        ) {

            return res.status(400).json({
                message:
                    "You cannot send an adoption request for your own pet."
            });

        }


        // =====================================
        // CHECK EXISTING REQUEST
        // =====================================

        const existingRequest =
            await AdoptionRequest.findOne({

                pet: pet._id,

                requester: userId,

                status: "Pending"

            });


        if (existingRequest) {

            return res.status(400).json({
                message:
                    "You already sent an adoption request for this pet."
            });

        }


        // =====================================
        // CREATE ADOPTION REQUEST
        // =====================================

        const adoptionRequest =
            new AdoptionRequest({

                pet: pet._id,

                requester: userId,

                owner: pet.owner,

                message: message.trim(),

                status: "Pending"

            });


        // =====================================
        // SAVE TO MONGODB
        // =====================================

        await adoptionRequest.save();


        // =====================================
        // SUCCESS
        // =====================================

        return res.status(201).json({

            message:
                "Adoption request sent successfully!",

            requestId:
                adoptionRequest._id

        });


    } catch (error) {

        console.error(
            "Adoption request error:",
            error
        );


        return res.status(500).json({

            message:
                "Unable to send adoption request.",

            error:
                error.message

        });

    }

});


module.exports = router;