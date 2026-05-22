// const express = require("express")
import express from "express";
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
router.get("/:id", getSingleOrder);

export default router;