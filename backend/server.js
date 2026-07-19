const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to PetConnect Backend!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});