const Product = require("../../models/product/product");
const ProductHistory = require("../../models/product/productHistory");

// Get All Products
const getAllProducts = async (req, res) => {
  const findAllProducts = await Product.find().sort({ expirationDate: 1 }); // -1 for descending;
  res.json(findAllProducts);
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await Product.findByIdAndDelete(productId);
    res.send(result);
    await ProductHistory.create({
      userID: result.userID,
      items: result.items,
      packSize: result.packSize,
      stock: result.stock,
      supplier: result.supplier,
      production: result.production,
      expirationDate: result.expirationDate,
      city: result.city,
      area: result.area,
      warehouseNumber: result.warehouseNumber,
      requestType: "Inventory Deleted",
    });
  } catch (e) {
    res.status(402).send(e);
  }
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const userId = req.body.userId;
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
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
      },
      { new: true }
    );
    await ProductHistory.create({
      userID: userId,
      items: updatedResult.items,
      packSize: updatedResult.packSize,
      stock: updatedResult.stock,
      supplier: updatedResult.supplier,
      unitPrice: updatedResult.unitPrice,
      production: updatedResult.production,
      expirationDate: updatedResult.expirationDate,
      city: updatedResult.city,
      area: updatedResult.area,
      warehouseNumber: updatedResult.warehouseNumber,
      requestType: "Inventory Updated",
    });

    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Products
const searchProduct = async (req, res) => {
  try {
    // Ensure searchTerm is a string or provide a default value
    const searchTerm = req.query.searchTerm ? String(req.query.searchTerm) : '';

    // Perform the search only if searchTerm is not an empty string
    const products = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    // Return the search results
    res.json(products);
  } catch (error) {
    // Handle any potential errors
    console.error("Error searching products:", error);
    res.status(500).json({ message: "An error occurred during the search." });
  }
};

module.exports = {
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
};
