const express = require("express");
const app = express();
const grn = require("../../controller/grn/grn");



app.post("/add", grn.addGRN);

app.get("/get/:userId", grn.getAllGRNs);

app.get("/search", grn.searchGRN);

module.exports = app;
