import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// =======================================
// REGISTER ADMIN
// =======================================
export const registerAdmin = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // check existing admin
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// LOGIN ADMIN
// =======================================
export const loginAdmin = async (req, res) => {

  try {

    const { email, password } = req.body;

    // check admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =======================================
// GET ADMIN PROFILE
// =======================================
export const getAdminProfile = async (
  req,
  res
) => {

  try {

    const admin = await Admin.findById(
      req.admin.id
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// =======================================
// FORGOT PASSWORD (ADMIN)
// =======================================
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin with this email does not exist." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and 1-hour expiration time to the DB
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = Date.now() + 3600000; 
    await admin.save();

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Reset link pointing to the dedicated admin frontend URL layout
  // Change this line inside forgotAdminPassword:
const resetUrl = `${process.env.ADMIN_FRONTEND_URL}/admin/reset-password/${resetToken}`;
    const mailOptions = {
      to: admin.email,
      from: process.env.EMAIL_USER,
      subject: "Admin Portal Password Reset Requests",
      html: `
        <h3>Admin Portal Security Recovery</h3>
        <p>A password reset was requested for your administrator profile.</p>
        <p>Click the link below to change your security credentials securely. This link is valid for 1 hour:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>If you did not make this request, please change your security protocols immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Admin recovery link sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// =======================================
// RESET PASSWORD (ADMIN)
// =======================================
export const resetAdminPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Token is invalid or has expired." });
    }

    // Hash the new security string
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Clear temporary reset tokens
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};