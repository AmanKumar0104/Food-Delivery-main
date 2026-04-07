import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// add food items
// add food items
const addFood = async (req, res) => {
  try {
    const { userId, name, description, price, category, rating } = req.body;
    const userData = await userModel.findById(userId);

    if (!userData || userData.role !== "admin") {
      console.log(`[AUTH] Admin access denied for user: ${userId} (${userData?.email || 'Unknown User'})`);
      return res.json({ success: false, message: "Unauthorized: Admin privileges required" });
    }

    if (!req.file) {
      return res.json({ success: false, message: "Food image is required" });
    }

    const food = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image: req.file.filename,
      rating: Number(rating) || 4.0,
    });

    await food.save();
    console.log(`[SUCCESS] Food added by admin: ${userData.email}`);
    res.json({ success: true, message: "Food Added successfully! ✅" });
  } catch (error) {
    console.error("[ERROR] Could not add food:", error);
    res.json({ success: false, message: "Failed to add food" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("[ERROR] Could not list foods:", error);
    res.json({ success: false, message: "Failed to fetch food list" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const { userId, id } = req.body;
    const userData = await userModel.findById(userId);

    if (!userData || userData.role !== "admin") {
      console.log(`[AUTH] Admin delete denied for user: ${userId}`);
      return res.json({ success: false, message: "Unauthorized: Admin privileges required" });
    }

    const food = await foodModel.findById(id);
    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    if (food.image && !food.image.startsWith("http")) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.log("[FILE] Image cleanup error:", err);
      });
    }

    await foodModel.findByIdAndDelete(id);
    console.log(`[SUCCESS] Food removed by admin: ${userData.email} (Item ID: ${id})`);
    res.json({ success: true, message: "Food Removed successfully! 🗑️" });
  } catch (error) {
    console.error("[ERROR] Could not remove food:", error);
    res.json({ success: false, message: "Failed to remove item" });
  }
};

// update food item
const updateFood = async (req, res) => {
  try {
    const { userId, id, name, description, price, category, rating } = req.body;
    const userData = await userModel.findById(userId);

    if (!userData || userData.role !== "admin") {
      return res.json({ success: false, message: "Unauthorized: Admin privileges required" });
    }

    const updateData = { name, description, price: Number(price), category, rating: Number(rating) };

    if (req.file) {
      const existingFood = await foodModel.findById(id);
      if (existingFood && existingFood.image && !existingFood.image.startsWith("http")) {
        fs.unlink(`uploads/${existingFood.image}`, () => {});
      }
      updateData.image = req.file.filename;
    }

    await foodModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Food Updated successfully! 🛠️" });
  } catch (error) {
    console.error("[ERROR] Could not update food:", error);
    res.json({ success: false, message: "Failed to update item" });
  }
};

export { addFood, listFood, removeFood, updateFood };

