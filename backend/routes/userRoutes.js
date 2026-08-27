const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();


// ===============================
// REGISTER
// ===============================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;


        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered!"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = new User({

            name,
            email,
            phone,
            password: hashedPassword

        });


        await user.save();


        res.status(201).json({

            message: "User Registered Successfully!"

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await User.findOne({ email });


        if (!user) {

            return res.status(400).json({

                message: "User not found!"

            });

        }


        // Banned users cannot log in
        if (user.banned) {

            return res.status(403).json({

                message: "Your account has been banned by the admin."

            });

        }


        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid Password!"

            });

        }


        // Create JWT token
        const token = jwt.sign(

            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        res.status(200).json({

            message: "Login Successful!",

            token: token,

            user: {

                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role

            }

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// ===============================
// GET CURRENT USER
// ===============================

router.get(
    "/me",
    require("../authMiddleware"),
    async (req, res) => {

        try {

            const user =
                await User.findById(req.user.id)
                .select("-password");


            if (!user) {

                return res.status(404).json({

                    message: "User not found!"

                });

            }


            res.status(200).json(user);


        } catch (error) {

            res.status(500).json({

                message: error.message

            });

        }

    }
);


module.exports = router;