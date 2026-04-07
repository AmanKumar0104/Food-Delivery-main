
import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB for seeding");

    const uploadsDir = path.join(process.cwd(), "uploads");
    const files = fs.readdirSync(uploadsDir);

    // Read food data from separate JSON file
    const foodDataPath = path.join(process.cwd(), "foodData.json");
    const indianFood = JSON.parse(fs.readFileSync(foodDataPath, 'utf8'));

    // Create a map of base names (food_X.png) to actual long names
    const imageMap = {};
    for (let i = 1; i <= 32; i++) {
      const match = files.find(f => f.endsWith(`food_${i}.png`));
      if (match) {
        imageMap[`food_${i}.png`] = match;
      } else {
        imageMap[`food_${i}.png`] = `food_${i}.png`; 
      }
    }

    // Remove existing items
    await foodModel.deleteMany({});
    console.log("Existing food items removed");

    // Prepare items for insertion
    const itemsWithImages = indianFood.map((item) => {
      let imageName = "samosa.png"; // Default
      const name = item.name.toLowerCase();

      if (name.includes("samosa")) imageName = "samosa.png";
      else if (name.includes("paneer tikka")) imageName = "paneer_tikka.png";
      else if (name.includes("chicken tikka")) imageName = "chicken_tikka.png";
      else if (name.includes("hara bhara")) imageName = "hara_bhara_kabab.png";
      else if (name.includes("gobi manchurian")) imageName = "gobi_manchurian.png";
      else if (name.includes("chicken lollipop")) imageName = "chicken_lollipop.png";
      else if (name.includes("aloo tikki")) imageName = "aloo_tikki.png";
      else if (name.includes("fish fry")) imageName = "fish_fry.png";
      else if (name.includes("spring roll")) imageName = "spring_rolls.png";
      else if (name.includes("onion bhaji") || name.includes("onion fritter")) imageName = "onion_bhaji.png";
      else if (name.includes("vada pav")) imageName = "vada_pav.png";
      else if (name.includes("dahi vada")) imageName = "dahi_vada.png";
      else if (name.includes("chili chicken")) imageName = "chili_chicken.png";
      else if (name.includes("mushroom tikka")) imageName = "mushroom_tikka.png";
      else if (name.includes("egg pakora")) imageName = "egg_pakora.png";
      else if (name.includes("paneer butter") || name.includes("shahi paneer")) imageName = "paneer_butter_masala.png";
      else if (name.includes("dal makhani")) imageName = "dal_makhani.png";
      else if (name.includes("chole bhature")) imageName = "chole_bhature.png";
      else if (name.includes("paneer")) imageName = "paneer_butter_masala.png";
      else if (name.includes("chicken")) imageName = "chicken_tikka.png";
      else if (name.includes("dal")) imageName = "dal_makhani.png";

      return {
        ...item,
        image: imageName,
        rating: item.rating || parseFloat((4 + Math.random()).toFixed(1))
      };
    });

    // Insert items
    await foodModel.insertMany(itemsWithImages);
    console.log(`${itemsWithImages.length} food items seeded from foodData.json`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
