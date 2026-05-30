import express from "express";

import {
  createVariant,
  getVariants,
  deleteVariant,
} from "../controllers/variant.controller.js";

const router = express.Router();

router.post(
  "/",
  createVariant
);

router.get(
  "/",
  getVariants
);

router.delete(
  "/:id",
  deleteVariant
);

export default router;