const express = require("express");

const askGemini =
    require("../gemini");

const router = express.Router();


// =====================================
// ASK PAWS - GEMINI AI
// =====================================

router.post(
    "/ask-ai",
    async (req, res) => {

        try {

            const { question } =
                req.body;


            if (
                !question ||
                !question.trim()
            ) {

                return res.status(400).json({

                    message:
                        "Please enter a question."

                });

            }


            const answer =
                await askGemini(
                    question
                );


            return res.status(200).json({

                answer: answer

            });


        } catch (error) {

            console.error(
                "Ask Paws AI error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to get AI response.",

                error:
                    error.message

            });

        }

    }
);


module.exports =
    router;