
import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const foods = await foodModel.find({ name: /paneer butter masala/i });
        console.log("Paneer Butter Masala record:", JSON.stringify(foods, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
