import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
// ---------------- REGISTER USER ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- LOGIN USER ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
      console.log("not found");
      
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET PROFILE ----------------
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// import User from "../models/User.model.js";

// ===================================
// GET ALL USERS
// ===================================
export const getAllUsers = async (
  req,
  res
) => {

  try {

    const search =
      req.query.search || "";

    const users =
      await User.find({

        name: {
          $regex: search,
          $options: "i",
        },
      }).select("-password");

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch users",
    });
  }
};

// ===================================
// GET SINGLE USER
// ===================================
export const getSingleUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        ).select("-password");

      if (!user) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "User not found",
          });
      }

      res.status(200).json({
        success: true,
        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch user",
      });
    }
  };

  // import User from "../models/User.model.js";

// ===================================
// DELETE USER
// ===================================
export const deleteUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "User not found",
          });
      }

      await User.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "User deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete user",
      });
    }
  };

  // ---------------- FORGOT PASSWORD (Verify Email) ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    // Generate a secure, temporary random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and set expiration (1 hour from now) to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create Email Transporter (Use your real SMTP details or environment variables)
    const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Matches EMAIL_USER in .env
    pass: process.env.EMAIL_PASS, // Matches EMAIL_PASS in .env
  },
});

    // Link pointing directly to your Frontend Reset Password URL route
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Please click the link below to securely reset your password. This link is valid for 1 hour:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Reset link emailed successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- RESET PASSWORD (Verify Token & Update DB) ----------------
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find the user with matching token and ensure token hasn't expired yet
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    // Hash the new password string
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear temporary reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};