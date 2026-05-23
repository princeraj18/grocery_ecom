// routes/contact.routes.js

import express from "express";

import {
  createContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
} from "../controllers/contact.controller.js";

const router = express.Router();

// Create Contact
router.post(
  "/",
  createContact
);

// Get All Contacts
router.get(
  "/",
  getAllContacts
);

// Get Single Contact
router.get(
  "/:id",
  getSingleContact
);

// Delete Contact
router.delete(
  "/:id",
  deleteContact
);

export default router;