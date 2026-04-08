import mongoose from "mongoose";
import "dotenv/config";

const exploreUsers = async () => {
  try {
    // Explicitly connect to the 'test' database
    const dbUrl = process.env.MONGO_URL.replace("/?", "/test?");
    await mongoose.connect(dbUrl);
    console.log("Connected to 'test' database.");
    
    const User = mongoose.models.users || mongoose.model("users", new mongoose.Schema({ name: String, email: String }, { strict: false }));
    const users = await User.find({}, 'name email').lean();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.name} (${u.email})`));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

exploreUsers();
