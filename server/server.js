const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: './.env' });
require("dotenv").config({ path: './config.env' });

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true })); // Corrected body-parser warning

const connectDB = require("./connection"); // Make sure the function is correct
const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);


const PORT = 3500;
app.listen(PORT, 'localhost', async () => {
    try {
        await connectDB(); // Corrected function name
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error("Error starting server:", err); // More specific error handling
        process.exit(1);
    }
});

