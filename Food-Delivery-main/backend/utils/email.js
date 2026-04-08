import nodemailer from "nodemailer";
import "dotenv/config";

// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a password reset email to the specified user.
 * @param {string} email - Recipient email address
 * @param {string} token - Password reset token
 */
export const sendResetEmail = async (email, token) => {
  // Using port 3001 as verified in vite.config.js, or 3000 per your instructions
  const resetLink = `http://localhost:3001/reset-password/${token}`;

  const mailOptions = {
    from: `"Tomato Food Delivery" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - Tomato",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ff4c24; text-align: center;">Tomato.</h2>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <h3 style="color: #333;">Reset Your Password</h3>
        <p style="color: #555; line-height: 1.6;">You requested a password reset for your account. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #ff4c24; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 0.85rem;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #ff4c24; font-size: 0.85rem; word-break: break-all;">${resetLink}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 0.8rem; text-align: center;">This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email successfully delivered to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ NODEMAILER ERROR:", error.message);
    throw new Error("SMTP_FAILURE");
  }
};
