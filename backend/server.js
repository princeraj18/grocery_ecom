import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import { connectCloudinary } from "./config/cloudinary.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
connectDB();
connectCloudinary();

import path from "path";

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================
// ROUTES
// ======================
app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/contacts",
  contactRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/vendors",
  vendorRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// Serve local uploads as a fallback when Cloudinary isn't available
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send(
    "ShopEase Backend Running"
  );
});

// ======================
// GLOBAL ERROR HANDLER
// ======================
app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.log(
      "GLOBAL ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Server Error",
    });
  }
);

// ======================
// SERVER
// ======================
const PORT =
  process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );
  }
);

// Increase timeout
server.timeout = 120000;