import mongoose from "mongoose";
import "dotenv/config";

const listAvailableDBs = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB.");
    
    // Using admin() on the connection to list databases
    const admin = conn.connection.db.admin();
    const dbsList = await admin.listDatabases();
    
    console.log("Available Databases:");
    dbsList.databases.forEach(db => console.log(`- ${db.name}`));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

listAvailableDBs();
