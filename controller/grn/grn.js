const Product = require("../../models/product/product");
const ProductHistory = require("../../models/product/productHistory");
const GRN = require("../../models/grn/grn");
const GRNHistory = require("../../models/grn/grnHistory");
const accountPayable = require("../../models/ledgers/accountPayable");

// Add GRN
const addGRN = async (req, res) => {
  try {
    await GRN.create({
      userID: req.body.userId,
      items: req.body.items,
      packSize: req.body.packSize,
      stock: req.body.stock,
      supplier: req.body.supplier,
      price: req.body.price,
      transportCost: req.body.transportCost,
      laborCost: req.body.laborCost,
      total: req.body.total,
      purchaseDate: req.body.purchaseDate,
      production: req.body.production,
      expirationDate: req.body.expirationDate,
      city: req.body.city,
      area: req.body.area,
      warehouseNumber: req.body.warehouseNumber,
    });

    await GRNHistory.create({
      userID: req.body.userId,
      items: req.body.items,
      packSize: req.body.packSize,
      stock: req.body.stock,
      supplier: req.body.supplier,
      price: req.body.price,
      transportCost: req.body.transportCost,
      laborCost: req.body.laborCost,
      total: req.body.total,
      purchaseDate: req.body.purchaseDate,
      production: req.body.production,
      expirationDate: req.body.expirationDate,
      city: req.body.city,
      area: req.body.area,
      warehouseNumber: req.body.warehouseNumber,
      requestType: "GRN Created",
    });

    await Product.create({
      userID: req.body.userId,
      items: req.body.items,
      packSize: req.body.packSize,
      stock: req.body.stock,
      supplier: req.body.supplier,
      production: req.body.production,
      expirationDate: req.body.expirationDate,
      city: req.body.city,
      area: req.body.area,
      warehouseNumber: req.body.warehouseNumber,
    });

    await ProductHistory.create({
      userID: req.body.userId,
      items: req.body.items,
      packSize: req.body.packSize,
      stock: req.body.stock,
      supplier: req.body.supplier,
      production: req.body.production,
      expirationDate: req.body.expirationDate,
      city: req.body.city,
      area: req.body.area,
      warehouseNumber: req.body.warehouseNumber,
      requestType: "Inventory Added",
    });

    if (req.body.supplier) {
      const account = await accountPayable.findOne({ name: req.body.supplier });
      if (account) {
        const newTransaction = {
          date: new Date(),
          amount: req.body.total,
          type: "credit",
          debit: 0,
          credit: req.body.total,
        };
        account.transactions.push(newTransaction);
        const transactionAmount =
          newTransaction.type === "credit"
            ? -newTransaction.amount
            : newTransaction.amount;
        account.total += transactionAmount;
        await account.save();
      }
    }
    res
      .status(200)
      .send({ message: "Inventory and GRN and their History Created" });
  } catch (e) {
    res.status(402).send({ message: e.message });
  }
};

// Get All GRNs
const getAllGRNs = async (req, res) => {
  const findAllGRNs = await GRN.find().sort({ expirationDate: 1 }); // -1 for descending;
  res.json(findAllGRNs);
};

// Search GRNs
const searchGRN = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const grns = await GRN.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(grns);
};

module.exports = {
  addGRN,
  getAllGRNs,
  searchGRN,
};
