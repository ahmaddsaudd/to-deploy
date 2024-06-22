const mongoose = require("mongoose");

const GRNHistorySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: {
      type: Object,
      ref: "item",
      required: true,
    },
    packSize: {
      type: Object,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    transportCost: {
      type: Number,
      required: true,
    },
    laborCost: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: String,
      required: true,
    },
    production: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      requried: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    warehouseNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const GRNHistory = mongoose.model("grnHistory", GRNHistorySchema);
module.exports = GRNHistory;
