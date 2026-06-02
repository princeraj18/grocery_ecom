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

      const contact =
        await Contact.create({
          userId: req.user?._id,
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

      console.log(error);

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

  
// =====================================
// REPLY TO CONTACT
// =====================================

import nodemailer from "nodemailer";

export const replyContact =
  async (req, res) => {

    try {

      const { reply } =
        req.body;

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

      // SAVE REPLY
      contact.adminReply =
        reply;

      contact.status =
        "Resolved";

      await contact.save();

      // SEND EMAIL

      const transporter =
        nodemailer.createTransport({
          service: "gmail",

          auth: {
            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,
          },
        });

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to:
          contact.email,

        subject:
          `Reply: ${contact.subject}`,

        html: `
          <div style="font-family:sans-serif;">
            <h2>Hello ${contact.name},</h2>

            <p>Thank you for contacting support.</p>

            <h3>Your Query:</h3>

            <p>${contact.message}</p>

            <hr/>

            <h3>Admin Reply:</h3>

            <p>${reply}</p>

            <br/>

            <p>Regards,</p>

            <h4>Support Team</h4>
          </div>
        `,
      });

      res.status(200).json({
        success: true,
        message:
          "Reply sent successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };




  // =====================================
// GET USER SUPPORT MESSAGES
// =====================================
export const getUserContacts =
  async (req, res) => {

    try {

      if (!req.user) {

        return res.status(401).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      const contacts =
        await Contact.find({
          userId:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        contacts,
      });

    } catch (error) {

      console.log(
        "GET USER CONTACTS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  // =====================================
// ADMIN REPLY TO CONTACT
// =====================================
export const replyToContact =
  async (req, res) => {

    try {

      const { reply } =
        req.body;

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

      contact.adminReply =
        reply;

      contact.status =
        "Resolved";

      await contact.save();

      res.status(200).json({
        success: true,
        message:
          "Reply sent successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };