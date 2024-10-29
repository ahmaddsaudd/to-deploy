const Product = require("../../models/product/product");
const ProductHistory = require("../../models/product/productHistory");
const GRN = require("../../models/grn/grn");
const GRNHistory = require("../../models/grn/grnHistory");
const accountPayable = require("../../models/ledgers/accountPayable");

// Add GRN
const addGRN1 = async (req, res) => {
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

const addGRN = async (req, res) => {
  console.log("here");
  try {
    // Create a new GRN document
    const grn = await GRN.create({
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

    // Create a GRN history entry
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
    // Loop through each item in items array to create Product and ProductHistory records
    for (const item of req.body.items) {
      const productData = {
        userID: req.body.userId,
        itemID: item.id,
        items:item,
        packSize: item.packSize,
        stock: item.stock,
        supplier: req.body.supplier,
        production: item.production,
        expirationDate: item.expirationDate,
        city: item.city,
        area: item.area,
        warehouseNumber: item.warehouseNumber,
      };

      await Product.create(productData);

      // Create ProductHistory
      await ProductHistory.create({
        ...productData,
        requestType: "Inventory Added",
      });
    }

    // Update accountPayable if supplier exists
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
        account.total += newTransaction.type === "credit" ? -newTransaction.amount : newTransaction.amount;
        await account.save();
      }
    }

    res.status(200).send({ message: "Inventory and GRN and their History Created" });
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
