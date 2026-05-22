import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import cartRoutes from "./routes/cart.routes.js";

connectDB();

const app = express();



app.use(cors());
app.use(express.json());


// const orderRoutes = require("./routes/order.routes.js");
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use("/api/cart", cartRoutes);
app.use(
  "/api/payment",
  paymentRoutes
);

app.get("/", (req, res) => {
  res.send("ShopEase Backend is Running");
});

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});