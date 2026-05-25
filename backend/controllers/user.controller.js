import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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