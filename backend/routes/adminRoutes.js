const express = require("express");

const Pet = require("../models/Pet");
const User = require("../models/User");
const AdoptionRequest = require("../models/AdoptionRequest");

const protect = require("../authMiddleware");
const isAdmin = require("../adminMiddleware");

const router = express.Router();


// =====================================================
// Every route below requires:
// 1) a valid logged-in user (protect)
// 2) that user's role to be "admin" (isAdmin)
// =====================================================


// =====================================================
// 1. OVERVIEW STATS
// =====================================================

router.get(
    "/admin/overview",
    protect,
    isAdmin,
    async (req, res) => {

        try {

            const totalPets =
                await Pet.countDocuments();

            const availablePets =
                await Pet.countDocuments({
                    adoptionStatus: "Available"
                });

            const adoptedPets =
                await Pet.countDocuments({
                    adoptionStatus: "Adopted"
                });

            const totalUsers =
                await User.countDocuments({
                    role: { $ne: "admin" }
                });


            res.status(200).json({

                totalPets,
                availablePets,
                adoptedPets,
                totalUsers

            });

        } catch (error) {

            console.error(
                "Admin overview error:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// =====================================================
// 2. GET ALL PETS (with owner info, every status)
// =====================================================

router.get(
    "/admin/pets",
    protect,
    isAdmin,
    async (req, res) => {

        try {

            const pets =
                await Pet.find()
                    .populate("owner", "name email")
                    .sort({ createdAt: -1 });

            res.status(200).json(pets);

        } catch (error) {

            console.error(
                "Admin get pets error:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// =====================================================
// 3. DELETE ANY PET POST (admin override)
// =====================================================
// Unlike the owner-only DELETE /pets/:id route,
// this lets an admin remove any post regardless
// of who owns it — e.g. inappropriate/spam listings.
// =====================================================

router.delete(
    "/admin/pets/:id",
    protect,
    isAdmin,
    async (req, res) => {

        try {

            const pet =
                await Pet.findById(req.params.id);

            if (!pet) {

                return res.status(404).json({
                    message: "Pet not found!"
                });

            }

            // Clean up any adoption requests tied
            // to this pet so no orphaned records remain
            await AdoptionRequest.deleteMany({
                pet: pet._id
            });

            await Pet.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "Pet post deleted successfully!"
            });

        } catch (error) {

            console.error(
                "Admin delete pet error:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// =====================================================
// 4. GET ALL USERS (never send back passwords)
// =====================================================

router.get(
    "/admin/users",
    protect,
    isAdmin,
    async (req, res) => {

        try {

            const users =
                await User.find({
                    role: { $ne: "admin" }
                })
                .select("-password")
                .sort({ _id: -1 });

            res.status(200).json(users);

        } catch (error) {

            console.error(
                "Admin get users error:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// =====================================================
// 5. BAN / UNBAN A USER
// =====================================================
// Toggles the "banned" flag. An admin account can
// never be banned, and an admin cannot ban themself.
// =====================================================

router.patch(
    "/admin/users/:id/ban",
    protect,
    isAdmin,
    async (req, res) => {

        try {

            const targetUser =
                await User.findById(req.params.id);

            if (!targetUser) {

                return res.status(404).json({
                    message: "User not found!"
                });

            }

            if (targetUser.role === "admin") {

                return res.status(400).json({
                    message: "Admin accounts cannot be banned."
                });

            }

            const adminId =
                req.user._id || req.user.id;

            if (
                adminId &&
                targetUser._id.toString() === adminId.toString()
            ) {

                return res.status(400).json({
                    message: "You cannot ban your own account."
                });

            }

            // Toggle
            targetUser.banned = !targetUser.banned;

            await targetUser.save();

            res.status(200).json({

                message: targetUser.banned
                    ? "User banned successfully!"
                    : "User unbanned successfully!",

                banned: targetUser.banned

            });

        } catch (error) {

            console.error(
                "Admin ban user error:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


module.exports = router;
