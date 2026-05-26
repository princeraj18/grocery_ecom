import Vendor from "../models/Vendor.model.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";
// ==============================
// REGISTER VENDOR
// ==============================
export const registerVendor = async (req, res) => {

  try {

    const {
      shopName,
      ownerName,
      email,
      password,
      phone,
      address,
    } = req.body;

    // CHECK EMAIL
    const vendorExists =
      await Vendor.findOne({ email });

    if (vendorExists) {

      return res.status(400).json({
        success: false,
        message: "Vendor already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE VENDOR
    const vendor =
      await Vendor.create({
        shopName,
        ownerName,
        email,
        password: hashedPassword,
        phone,
        address,
      });

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: vendor._id,
        role: vendor.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // SEND RESPONSE
    res.status(201).json({
      success: true,
      message:
        "Vendor Registered Successfully",
      token,
      vendor,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// LOGIN VENDOR
// ==============================
export const loginVendor =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      // CHECK VENDOR
      const vendor =
        await Vendor.findOne({
          email,
        });

      if (!vendor) {

        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      // CHECK PASSWORD
      const isMatch =
        await bcrypt.compare(
          password,
          vendor.password
        );

      if (!isMatch) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid credentials",
        });
      }

      // JWT TOKEN
      const token =
        jwt.sign(
          {
            id: vendor._id,
            role: vendor.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Vendor Login Successful",
        token,
        vendor,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==============================
// GET ALL VENDORS
// ==============================
export const getVendors =
  async (req, res) => {

    try {

      const vendors =
        await Vendor.find();

      res.status(200).json({
        success: true,
        vendors,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==============================
// GET SINGLE VENDOR
// ==============================
export const getSingleVendor =
  async (req, res) => {

    try {

      const vendor =
        await Vendor.findById(
          req.params.id
        );

      if (!vendor) {

        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      res.status(200).json({
        success: true,
        vendor,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==============================
// UPDATE VENDOR
// ==============================
export const updateVendor =
  async (req, res) => {

    try {

      const vendor =
        await Vendor.findById(
          req.params.id
        );

      if (!vendor) {

        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      vendor.shopName =
        req.body.shopName ||
        vendor.shopName;

      vendor.ownerName =
        req.body.ownerName ||
        vendor.ownerName;

      vendor.phone =
        req.body.phone ||
        vendor.phone;

      vendor.address =
        req.body.address ||
        vendor.address;

      // LOGO
      if (req.file) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "auto", folder: "vendors/logos", public_id: `${Date.now()}-${req.file.originalname}` },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );

            stream.end(req.file.buffer);
          });

          vendor.logo = uploadResult.secure_url || uploadResult.url || "";
        } catch (err) {
          // fallback to local uploads
          const uploadsDir = path.join(process.cwd(), "uploads");
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

          const safeName = `${Date.now()}-${(req.file.originalname || "logo").replace(/\s+/g, "-")}`;
          const filePath = path.join(uploadsDir, safeName);
          fs.writeFileSync(filePath, req.file.buffer);

          vendor.logo = `${process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`}/uploads/${safeName}`;

          console.warn("Vendor logo upload failed, saved locally:", err.message || err);
        }
      }

      await vendor.save();

      res.status(200).json({
        success: true,
        message:
          "Vendor updated successfully",
        vendor,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ==============================
// DELETE VENDOR
// ==============================
export const deleteVendor =
  async (req, res) => {

    try {

      const vendor =
        await Vendor.findByIdAndDelete(
          req.params.id
        );

      if (!vendor) {

        return res.status(404).json({
          success: false,
          message:
            "Vendor not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Vendor deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// GET PROFILE
export const getVendorProfile =
  async (req, res) => {

    try {

      const vendor =
        await Vendor.findById(
          req.vendor._id
        ).select("-password");

      res.status(200).json(vendor);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };


  // ==============================
// VERIFY VENDOR
// ==============================
export const verifyVendor =
  async (req, res) => {

    try {

      const vendor =
        await Vendor.findById(
          req.params.id
        );

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      vendor.isVerified = true;

      await vendor.save();

      res.status(200).json({
        success: true,
        message: "Vendor verified successfully",
        vendor,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ==============================
// UNVERIFY VENDOR
// ==============================
export const unverifyVendor =
  async (req, res) => {

    try {

      const vendor =
        await Vendor.findById(
          req.params.id
        );

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      vendor.isVerified = false;

      await vendor.save();

      res.status(200).json({
        success: true,
        message: "Vendor unverified successfully",
        vendor,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ==============================
// FORGOT PASSWORD (VENDOR)
// ==============================
export const forgotVendorPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor with this email does not exist." });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and 1-hour expiration time
    vendor.resetPasswordToken = resetToken;
    vendor.resetPasswordExpires = Date.now() + 3600000; 
    await vendor.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Link points specifically to the vendor reset route variant
    const resetUrl = `${process.env.FRONTEND_URL}/vendor/reset-password/${resetToken}`;

    const mailOptions = {
      to: vendor.email,
      from: process.env.EMAIL_USER,
      subject: "Vendor Password Reset Request",
      html: `
        <h3>Vendor Portal Recovery</h3>
        <p>You requested a password reset for your vendor profile.</p>
        <p>Please click the link below to safely reset your credentials (valid for 1 hour):</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Vendor reset link sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// RESET PASSWORD (VENDOR)
// ==============================
export const resetVendorPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const vendor = await Vendor.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!vendor) {
      return res.status(400).json({ success: false, message: "Token is invalid or has expired." });
    }

    // Securely hash the new incoming password string
    const salt = await bcrypt.genSalt(10);
    vendor.password = await bcrypt.hash(password, salt);

    // Clear session tokens from document tracking
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpires = undefined;
    await vendor.save();

    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};