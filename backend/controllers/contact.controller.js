// controllers/contact.controller.js

import Contact from "../models/contact.model.js";

// =====================================
// CREATE CONTACT MESSAGE
// =====================================
export const createContact =
  async (req, res) => {
    try {
      const {
        name,
        email,
        subject,
        message,
      } = req.body;

      // Validation
      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required",
        });
      }

      // Create Contact
      const contact =
        await Contact.create({
          name,
          email,
          subject,
          message,
        });

      res.status(201).json({
        success: true,
        message:
          "Message sent successfully",
        contact,
      });
    } catch (error) {
      console.log(
        "CREATE CONTACT ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

// =====================================
// GET ALL CONTACTS
// =====================================
export const getAllContacts =
  async (req, res) => {
    try {
      const contacts =
        await Contact.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        contacts,
      });
    } catch (error) {
      console.log(
        "GET CONTACTS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

// =====================================
// GET SINGLE CONTACT
// =====================================
export const getSingleContact =
  async (req, res) => {
    try {
      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });
      }

      res.status(200).json({
        success: true,
        contact,
      });
    } catch (error) {
      console.log(
        "GET SINGLE CONTACT ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

// =====================================
// DELETE CONTACT
// =====================================
export const deleteContact =
  async (req, res) => {
    try {
      const contact =
        await Contact.findByIdAndDelete(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Contact deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE CONTACT ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };