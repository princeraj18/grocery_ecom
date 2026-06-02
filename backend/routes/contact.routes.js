import express from "express";

import {
  createContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
  replyContact,
  getUserContacts,
} from "../controllers/contact.controller.js";

import { protect } from "../middleware/auth.middlewar.js";

const router = express.Router();

// =====================================
// USER ROUTES
// =====================================

// CREATE CONTACT
router.post(
  "/",
  protect,
  createContact
);

// GET USER SUPPORTS
router.get(
  "/my-supports",
  protect,
  getUserContacts
);

// =====================================
// ADMIN ROUTES
// =====================================

// GET ALL CONTACTS
router.get(
  "/",
  getAllContacts
);

// GET SINGLE CONTACT
router.get(
  "/:id",
  getSingleContact
);

// DELETE CONTACT
router.delete(
  "/:id",
  deleteContact
);

// ADMIN REPLY
router.put(
  "/reply/:id",
  replyContact
);

export default router;