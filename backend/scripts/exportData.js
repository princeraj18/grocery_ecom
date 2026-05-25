import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Compute __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env if present next to this script, otherwise default
const backendEnv = path.join(__dirname, "..", ".env");
if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
  console.log("Loaded env from:", backendEnv);
} else {
  dotenv.config();
  console.log("Loaded env from default .env or system environment");
}

import connectDB from "../config/db.js";
import User from "../models/User.model.js";
import Vendor from "../models/Vendor.model.js";
import Order from "../models/Order.model.js";

async function main() {
  try {
    await connectDB();

    const exportDir = path.join(__dirname, "..", "exports");
    await fs.promises.mkdir(exportDir, { recursive: true });

    // Fetch users and remove password
    const users = await User.find().select("-password -__v").lean();

    // Fetch vendors and remove password
    const vendors = await Vendor.find().select("-password -__v").lean();

    // Fetch orders and populate user basic info
    const orders = await Order.find()
      .populate({ path: "user", select: "name email" })
      .lean();

    const usersPath = path.join(exportDir, "users.json");
    const vendorsPath = path.join(exportDir, "vendors.json");
    const ordersPath = path.join(exportDir, "orders.json");

    await fs.promises.writeFile(usersPath, JSON.stringify(users, null, 2), "utf8");
    await fs.promises.writeFile(vendorsPath, JSON.stringify(vendors, null, 2), "utf8");
    await fs.promises.writeFile(ordersPath, JSON.stringify(orders, null, 2), "utf8");

    console.log(`Exported users: ${users.length}`);
    console.log(`Exported vendors: ${vendors.length}`);
    console.log(`Exported orders: ${orders.length}`);
    console.log("Files:");
    console.log(usersPath);
    console.log(vendorsPath);
    console.log(ordersPath);

    process.exit(0);
  } catch (err) {
    console.error("Export failed:", err);
    process.exit(1);
  }
}

main();
