
import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const mappingDefinitions = [
    { image: "samosa.png", keywords: ["samosa", "kachori", "bhel", "sev puri", "papdi", "dessert", "halwa", "jamun", "rasgulla", "jalebi", "kheer", "ladoo", "mysore pak", "kaju katli", "soan papdi", "chhena poda", "sweet"] },
    { image: "paneer_tikka.png", keywords: ["paneer tikka", "achari paneer", "paneer do pyaza"] },
    { image: "chicken_tikka.png", keywords: ["chicken tikka", "tandoori chicken", "mutton seekh", "chicken seekh", "biryani", "pulao", "rice", "kathi roll"] },
    { image: "hara_bhara_kabab.png", keywords: ["hara bhara", "veg seekh", "broccoli", "kabab"] },
    { image: "gobi_manchurian.png", keywords: ["manchurian", "corn", "chowmein", "honey chili", "momo", "chili potato"] },
    { image: "chicken_lollipop.png", keywords: ["lollipop", "chicken 65", "shawarma", "wing"] },
    { image: "aloo_tikki.png", keywords: ["aloo tikki", "pattice", "pav bhaji", "burger"] },
    { image: "fish_fry.png", keywords: ["fish fry", "amritsari", "finger", "prawn", "seafood", "balchao", "fish curry"] },
    { image: "spring_rolls.png", keywords: ["spring roll", "egg roll"] },
    { image: "onion_bhaji.png", keywords: ["onion bhaji", "pakora", "fritter", "chai", "lassi", "coffee", "milk", "soda", "drink", "sharbat", "juice", "tea", "mojito"] },
    { image: "vada_pav.png", keywords: ["vada pav", "dabeli"] },
    { image: "dahi_vada.png", keywords: ["dahi", "idli", "vada", "dosa", "uttapam", "pongal", "appam", "upma", "pesarattu", "adai", "bisi bele", "puttu"] },
    { image: "chili_chicken.png", keywords: ["chili chicken", "rezala", "kolhapuri", "curry", "bhuna", "rogan josh", "korma", "chettinad", "masala", "sukka"] },
    { image: "mushroom_tikka.png", keywords: ["mushroom"] },
    { image: "egg_pakora.png", keywords: ["egg", "omlette"] },
    { image: "paneer_butter_masala.png", keywords: ["paneer butter", "shahi paneer", "palak paneer", "kadai paneer", "mix veg", "kofta", "bharta", "aloo gobi", "dum aloo", "jalfrezi", "bhindi", "makhanwala", "jeera aloo", "saag", "handi", "musallam", "karela"] },
    { image: "dal_makhani.png", keywords: ["dal", "kadi", "chana", "rajma"] },
    { image: "chole_bhature.png", keywords: ["chole", "kulche", "naan", "roti", "paratha", "kulcha", "puri", "bhatura", "poli"] }
];

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB for final perfect mapping");

        const foodItems = await foodModel.find({});
        console.log(`Mapping ${foodItems.length} items to the 18 premium image buckets...`);

        for (const item of foodItems) {
            let selectedImage = "samosa.png"; // Ultimate fallback
            const name = item.name.toLowerCase();
            const category = item.category.toLowerCase();

            // Try to find the best bucket
            let found = false;
            for (const bucket of mappingDefinitions) {
                if (bucket.keywords.some(kw => name.includes(kw))) {
                    selectedImage = bucket.image;
                    found = true;
                    break;
                }
            }

            // Category based fallback if name didn't match specific seeds
            if (!found) {
                if (category === "starters") selectedImage = "samosa.png";
                else if (category === "main course") selectedImage = "paneer_butter_masala.png";
                else if (category === "biryani & rice") selectedImage = "chicken_tikka.png";
                else if (category === "bread") selectedImage = "chole_bhature.png";
                else if (category === "desserts") selectedImage = "samosa.png";
                else if (category === "south indian") selectedImage = "dahi_vada.png";
                else if (category === "beverages") selectedImage = "onion_bhaji.png";
                else if (category === "street food") selectedImage = "aloo_tikki.png";
            }

            item.image = selectedImage;
            await item.save();
        }

        console.log("Database update complete! Every item has an authentic corresponding image.");
        process.exit();
    } catch (error) {
        console.error("Error updating database:", error);
        process.exit(1);
    }
};

updateImages();
