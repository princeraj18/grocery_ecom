import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.model.js";

const vendorAuth = async (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token =
      authHeader.split(" ")[1];

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

    console.log(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default vendorAuth;