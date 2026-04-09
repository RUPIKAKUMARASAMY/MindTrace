require('dotenv').config({ path: './.env' });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --------------------
// MongoDB Connection
// --------------------
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
});

// --------------------
// Health Check Route
// --------------------
app.get("/health", (req, res) => {
    res.json({ status: "Backend Running" });
});

// --------------------
// Random Forest Predict Route (10 Answers Required)
// --------------------
app.post("/predict", async (req, res) => {
    try {
        const { answers } = req.body;

        if (!answers || answers.length !== 10) {
            return res.status(400).json({
                error: "Please provide exactly 10 answers"
            });
        }

        const response = await axios.post(
            "http://127.0.0.1:5000/predict",
            { answers: answers }
        );

        return res.json(response.data);

    } catch (error) {
        console.error("ML Error:", error.message);
        return res.status(500).json({
            error: "Prediction failed. Make sure ML server is running."
        });
    }
});

// --------------------
// Start Server
// --------------------
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});