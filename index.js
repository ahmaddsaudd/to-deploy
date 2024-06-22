const mongoose = require("mongoose");
require('dotenv').config();


const uri = "mongodb+srv://MustafaAhmedSiddiqui:Mustafa15@firstcluster.ol1cziy.mongodb.net/inventory";

const mongoUri = process.env.MONGO_URI
function main() {
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB Atlas successfully!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB Atlas:", err);
    });
}

module.exports = { main };
