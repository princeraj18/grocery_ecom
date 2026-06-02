import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.model.js";

const vendorAuth = async (
  req,
  res,
  next
) => {

  try {

    const authHeader = req.headers.authorization || req.headers["x-access-token"] || req.headers["x-auth-token"];

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Support both `Bearer <token>` and bare token values
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const vendor =
      await Vendor.findById(
        decoded.id
      ).select("-password");

    if (!vendor) {

      return res.status(401).json({
        message: "Vendor not found",
      });
    }

    req.vendor = vendor;

    next();

  } catch (error) {

    // Helpful debug output for development
    console.log("vendorAuth error:", error.message || error);

    return res.status(401).json({
      message: "Invalid token",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default vendorAuth;