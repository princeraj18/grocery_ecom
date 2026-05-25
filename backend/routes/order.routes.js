// const express = require("express")
import express from "express";
import {
  getVendorOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import vendorAuth from "../middleware/vendorAuth.js";

const router = express.Router();

// const {
//   createOrder,
//   getAllOrders,
//   getSingleOrder,
// } = require("../controllers/order.controller");
import {createOrder, getAllOrders, getMyOrders, getSingleOrder} from "../controllers/order.controller.js";    
router.post("/create", createOrder);
router.get("/my-orders/:userId", getMyOrders);

router.get("/", getAllOrders);
// Vendor orders - static route must come before dynamic :id route
router.get(
  "/vendor",
  vendorAuth,
  getVendorOrders
);
router.get("/:id", getSingleOrder);

router.put(
  "/:id",
  vendorAuth,
  updateOrderStatus
);


export default router;