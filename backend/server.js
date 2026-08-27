const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const adoptionRoutes =  require("./routes/adoptionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Allow browser to access uploaded pet images
app.use("/uploads", express.static("uploads"));

app.use("/", userRoutes);
app.use("/", petRoutes);
app.use("/", adoptionRoutes);
app.use("/", aiRoutes);
app.use("/", adminRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Welcome to PetConnect Backend!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});