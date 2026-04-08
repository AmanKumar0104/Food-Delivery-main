/** 🔍 DIAGNOSTIC: Debugging User Routes **/
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import chatbotRouter from "./routes/chatbotRoute.js";
import contactRouter from "./routes/contactRoute.js";
import groupOrderRouter from "./routes/groupOrderRoute.js";
import { bootstrapAdmin } from "./config/bootstrapAdmin.js";


// app config
const app = express();
const port =process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB().then(async () => {
    // Bootstrap Admin account
    await bootstrapAdmin();
});


// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/contact", contactRouter);
app.use("/api/group-order", groupOrderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
  if (userRouter && userRouter.stack) {
    console.log("User Routes registered:");
    userRouter.stack.forEach(r => {
        if (r.route) {
            console.log(` - POST ${r.route.path}`);
        }
    });
  }
});
