const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();


async function createAdmin() {

    try {

        await connectDB();


        const adminEmail =
            process.env.ADMIN_EMAIL;

        const adminPassword =
            process.env.ADMIN_PASSWORD;


        if (
            !adminEmail ||
            !adminPassword
        ) {

            console.error(
                "ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env"
            );

            process.exit(1);

        }


        // Find existing account
        const existingUser =
            await User.findOne({
                email: adminEmail
            });


        // =====================================
        // EXISTING ACCOUNT
        // =====================================

        if (existingUser) {

            // Already an admin
            if (
                existingUser.role === "admin"
            ) {

                console.log(
                    "This account is already an admin."
                );

                process.exit(0);

            }


            // Promote existing account
            const hashedPassword =
                await bcrypt.hash(
                    adminPassword,
                    10
                );


            existingUser.password =
                hashedPassword;

            existingUser.role =
                "admin";


            await existingUser.save();


            console.log(
                "================================="
            );

            console.log(
                "Existing account promoted to admin!"
            );

            console.log(
                "Email:",
                existingUser.email
            );

            console.log(
                "Role:",
                existingUser.role
            );

            console.log(
                "================================="
            );


            process.exit(0);

        }


        // =====================================
        // CREATE NEW ADMIN
        // =====================================

        const hashedPassword =
            await bcrypt.hash(
                adminPassword,
                10
            );


        const admin =
            await User.create({

                name:
                    "PetConnect Admin",

                email:
                    adminEmail,

                password:
                    hashedPassword,

                role:
                    "admin"

            });


        console.log(
            "================================="
        );

        console.log(
            "Admin account created successfully!"
        );

        console.log(
            "Email:",
            admin.email
        );

        console.log(
            "Role:",
            admin.role
        );

        console.log(
            "================================="
        );


        process.exit(0);


    } catch (error) {

        console.error(
            "Error creating admin:",
            error.message
        );

        process.exit(1);

    }

}


createAdmin();