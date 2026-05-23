// routes/review.routes.js

import express from "express";

import {
  createReview,
  getAllReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReview);

router.get("/", getAllReviews);

router.delete("/:id", deleteReview);

export default router;