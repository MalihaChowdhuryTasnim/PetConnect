const express = require("express");

const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const protect = require("../authMiddleware");

const router = express.Router();


// =====================================
// 1. SEND ADOPTION REQUEST
// =====================================

router.post("/adoption-request", protect, async (req, res) => {

    try {

        const { petId, message } = req.body;


        if (!petId) {

            return res.status(400).json({
                message: "Pet ID is required."
            });

        }


        if (!message || !message.trim()) {

            return res.status(400).json({
                message: "Please write a message."
            });

        }


        const userId = req.user._id || req.user.id;


        if (!userId) {

            return res.status(401).json({
                message: "User authentication failed."
            });

        }


        const pet = await Pet.findById(petId);


        if (!pet) {

            return res.status(404).json({
                message: "Pet not found."
            });

        }


        // Owner cannot request own pet
        if (
            pet.owner &&
            pet.owner.toString() === userId.toString()
        ) {

            return res.status(400).json({
                message:
                    "You cannot send an adoption request for your own pet."
            });

        }


        // Check existing pending request
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


        // Create request
        const adoptionRequest =
            new AdoptionRequest({

                pet: pet._id,

                requester: userId,

                owner: pet.owner,

                message: message.trim(),

                status: "Pending"

            });


        await adoptionRequest.save();


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



// =====================================
// 2. MY ADOPTION REQUESTS
// =====================================
// Requests SENT BY the logged-in user
// =====================================

router.get(
    "/my-adoption-requests",
    protect,
    async (req, res) => {

        try {

            const userId =
                req.user._id || req.user.id;


            if (!userId) {

                return res.status(401).json({
                    message:
                        "User authentication failed."
                });

            }


            const requests =
                await AdoptionRequest.find({

                    requester: userId

                })

                .populate(
                    "pet",
                    "name category breed age image location"
                )

                .populate(
                    "owner",
                    "name email"
                )

                .sort({
                    createdAt: -1
                });


            return res.status(200).json(requests);


        } catch (error) {

            console.error(
                "Get my adoption requests error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to load your adoption requests.",

                error:
                    error.message

            });

        }

    }
);



// =====================================
// 3. OWNER ADOPTION REQUESTS
// =====================================
// Requests RECEIVED by the logged-in user
// =====================================

router.get(
    "/owner-adoption-requests",
    protect,
    async (req, res) => {

        try {

            const userId =
                req.user._id || req.user.id;


            if (!userId) {

                return res.status(401).json({

                    message:
                        "User authentication failed."

                });

            }


            const requests =
                await AdoptionRequest.find({

                    owner: userId

                })

                .populate(
                    "pet",
                    "name category breed age image location"
                )

                .populate(
                    "requester",
                    "name email"
                )

                .sort({
                    createdAt: -1
                });


            return res.status(200).json(requests);


        } catch (error) {

            console.error(
                "Owner adoption requests error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to load adoption requests.",

                error:
                    error.message

            });

        }

    }
);



// =====================================
// 4. OWNER ACCEPT / REJECT REQUEST
// =====================================

router.patch(
    "/adoption-request/:id/status",
    protect,
    async (req, res) => {

        try {

            const requestId =
                req.params.id;

            const { status } =
                req.body;


            if (
                status !== "Accepted" &&
                status !== "Rejected"
            ) {

                return res.status(400).json({

                    message:
                        "Status must be Accepted or Rejected."

                });

            }


            const userId =
                req.user._id || req.user.id;


            const adoptionRequest =
                await AdoptionRequest.findById(
                    requestId
                );


            if (!adoptionRequest) {

                return res.status(404).json({

                    message:
                        "Adoption request not found."

                });

            }


            // Only pet owner can accept/reject
            if (
                !adoptionRequest.owner ||
                adoptionRequest.owner.toString() !==
                userId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "You are not allowed to change this request."

                });

            }


            adoptionRequest.status =
                status;


            await adoptionRequest.save();


            return res.status(200).json({

                message:
                    `Adoption request ${status.toLowerCase()} successfully.`,

                request:
                    adoptionRequest

            });


        } catch (error) {

            console.error(
                "Update adoption request error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to update adoption request.",

                error:
                    error.message

            });

        }

    }
);



// =====================================
// 5. DELETE MY ADOPTION REQUEST
// =====================================
// Only requester can delete
// =====================================

router.delete(
    "/adoption-request/:id",
    protect,
    async (req, res) => {

        try {

            const requestId =
                req.params.id;


            const userId =
                req.user._id || req.user.id;


            const adoptionRequest =
                await AdoptionRequest.findById(
                    requestId
                );


            if (!adoptionRequest) {

                return res.status(404).json({

                    message:
                        "Adoption request not found."

                });

            }


            if (
                !adoptionRequest.requester ||
                adoptionRequest.requester.toString() !==
                userId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "You can only delete your own adoption request."

                });

            }


            await AdoptionRequest.findByIdAndDelete(
                requestId
            );


            return res.status(200).json({

                message:
                    "Adoption request deleted successfully."

            });


        } catch (error) {

            console.error(
                "Delete adoption request error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to delete adoption request.",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;