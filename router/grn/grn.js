const express = require("express");
const app = express();
const grn = require("../../controller/grn/grn");

// Add GRN
app.post("/add", grn.addGRN);

// Get All GRN
app.get("/get/:userId", grn.getAllGRNs);

// Search GRN
app.get("/search", grn.searchGRN);

module.exports = app;
