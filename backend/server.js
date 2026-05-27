import dotenv from "dotenv";
dotenv.config();
console.log("ENV TEST");
console.log(process.env.CLOUD_NAME);
import express from "express";
import { connectCloudinary } from "./config/cloudinary.js";

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
import dashboardRoutes from "./routes/dashboard.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import vendorAnalyticsRoutes
from "./routes/vendorAnalytics.routes.js";
import couponRoutes
from "./routes/coupon.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import wishlistRoutes
from "./routes/wishlist.routes.js";
import categoryRoutes from "./routes/category.routes.js";




connectDB();
// Ensure Cloudinary is checked at startup so controllers can skip cloud operations when unavailable
await connectCloudinary();

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
  "/api/categories",
  categoryRoutes
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
app.use(
  "/api/analytics",
  analyticsRoutes
);
app.use(
  "/api/wishlist",
  wishlistRoutes
);
app.use(
  "/api/vendor",
  vendorAnalyticsRoutes
);
app.use(
  "/api/coupons",
  couponRoutes
);
app.use("/api/reviews", reviewRoutes);
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