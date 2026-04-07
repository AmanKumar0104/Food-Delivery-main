import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

/**
 * Bootstraps a default admin account if it does not already exist.
 * Default Credentials:
 * Email: admin@tomato.com
 * Password: admin123
 */
// Bootstrap Admin account
export const bootstrapAdmin = async () => {
    try {
        const adminAccounts = [
            { name: "Tomato Admin", email: "admin@tomato.com", password: "admin123" },
            { name: "Aman Manager", email: "aman@tomato.com", password: "password123" }
        ];

        for (const account of adminAccounts) {
            const exists = await userModel.findOne({ email: account.email });
            if (!exists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(account.password, salt);
                
                const newAdmin = new userModel({
                    name: account.name,
                    email: account.email,
                    password: hashedPassword,
                    role: "admin"
                });
                await newAdmin.save();
                console.log(`🚀 Admin bootstrapped: ${account.email}`);
            } else if (exists.role !== "admin") {
                exists.role = "admin";
                await exists.save();
                console.log(`✅ Role updated to "admin" for: ${account.email}`);
            } else {
                console.log(`ℹ️ Admin active: ${account.email}`);
            }
        }
    } catch (error) {
        console.error("❌ Bootstrap failed:", error.message);
    }
};
