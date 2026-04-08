import nodemailer from "nodemailer";
import "dotenv/config";

async function testEmail() {
  console.log("Configuring transporter...");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Tomato Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Sending to yourself
    subject: "SMTP Server Test - Success! 🎉",
    text: "This is a test email from your Tomato Food Delivery backend. If you see this, your Gmail SMTP configuration is working perfectly!",
    html: "<b>Tomato Backend Test:</b> <br><br> Your Gmail App Password is configured correctly. You can now use the <b>Forgot Password</b> feature in your app!"
  };

  try {
    console.log("Attempting to send test email to:", process.env.EMAIL_USER);
    const info = await transporter.sendMail(mailOptions);
    console.log("Success! Email sent. ID:", info.messageId);
    console.log("Verification Checklist:");
    console.log("1. Check Inbox: " + process.env.EMAIL_USER);
    console.log("2. Check Spam folder (if not seen)");
  } catch (error) {
    console.error("CRITICAL SMTP ERROR:", error.message);
    if (error.message.includes("Invalid login")) {
      console.error("CAUSE: The 'EMAIL_PASS' in your .env file is likely WRONG or not an App Password.");
    } else if (error.message.includes("allow less secure apps")) {
      console.error("CAUSE: You must use a Gmail 'App Password' for modern security.");
    }
  }
}

testEmail();
