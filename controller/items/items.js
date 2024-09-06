const Item = require("../../models/items/items");
const ItemHistory = require("../../models/items/itemHistory");

// Add Item
const addItem = async (req, res) => {
  try {
    await Item.create({
      userID: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      packSize: req.body.packSize,
      units: req.body.units,
    });

    await ItemHistory.create({
      userID: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      packSize: req.body.packSize,
      units: req.body.units,
      requestType: "Item Created",
    });

    res.status(200).send({ message: "Item and History it's Created" });
  } catch (e) {
    res.status(402).send({ message: e.message });
  }
};

// Get All Items
const getAllItems = async (req, res) => {
  const findAllItems = await Item.find().sort({
    _id: -1,
  });
  res.json(findAllItems);
};

// Delete Selected Item
const deleteSelectedItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const result = await Item.findByIdAndDelete(itemId);
    res.send(result);
    await ItemHistory.create({
      userID: result.userID,
      name: result.name,
      category: result.category,
      packSize: result.packSize,
      units: result.units,
      requestType: "Item Deleted",
    });
  } catch (e) {
    res.status(402).send(e);
  }
};

// Update Selected Item
const updateSelectedItem = async (req, res) => {
  try {
    const userId = req.body.userId;
    const updatedResult = await Item.findByIdAndUpdate(
      { _id: req.body.itemID },
      {
        userID: req.body.userId,
        name: req.body.name,
        category: req.body.category,
        packSize: req.body.packSize,
        units: req.body.units,
      },
      { new: true }
    );
    await ItemHistory.create({
      userID: userId,
      name: updatedResult.name,
      category: updatedResult.category,
      packSize: updatedResult.packSize,
      units: updatedResult.units,
      requestType: "Item Updated",
    });

    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Items
const searchItem = async (req, res) => {
  try {
    // Ensure searchTerm is a valid string, defaulting to an empty string if undefined or null
    const searchTerm = req.query.searchTerm ? String(req.query.searchTerm) : '';

    // Query the database using $regex with case-insensitive option "i"
    const items = await Item.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    // Return the found items in the response
    res.json(items);
  } catch (error) {
    // Log the error and send a 500 response in case of an issue
    console.error("Error searching items:", error);
    res.status(500).json({ message: "An error occurred while searching for items." });
  }
};  

module.exports = {
  addItem,
  getAllItems,
  deleteSelectedItem,
  updateSelectedItem,
  searchItem,
};
