import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import { sendResetEmail } from "../utils/email.js";

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const role = user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const role = user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    await sendResetEmail(email, resetToken);
    
    res.json({ success: true, message: "Reset email sent successfully! 📧 Check your inbox." });
  } catch (error) {
    console.error("❌ FORGOT_PASSWORD_ERROR:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong while sending the email." });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = "";
    await user.save();

    res.json({ success: true, message: "Password successfully updated!" });

  } catch (error) {
    console.error("❌ RESET_PASSWORD_ERROR:", error.message);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};

const testEmailRoute = async (req, res) => {
  try {
    const { email } = req.body;
    await sendResetEmail(email || process.env.EMAIL_USER, "TEST_TOKEN_123");
    res.json({ success: true, message: "Test delivery successful! Your SMTP configuration is verified." });
  } catch (error) {
    console.error("❌ TEST EMAIL FAILED:", error.message);
    res.json({ success: false, message: `SMTP Failure: ${error.message}` });
  }
};

export { loginUser, registerUser, forgotPassword, resetPassword, testEmailRoute };
