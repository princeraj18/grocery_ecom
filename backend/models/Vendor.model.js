import mongoose from "mongoose";

const vendorSchema =
  new mongoose.Schema(
    {
      shopName: {
        type: String,
        required: true,
        trim: true,
      },

      ownerName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
      },

      address: {
        type: String,
      },

      logo: {
        type: String,
        default: "",
      },

      isVerified: {
        type: Boolean,
        default: false,
      },

      role: {
        type: String,
        default: "vendor",
      },
    },
    {
      timestamps: true,
    }
  );

const Vendor = mongoose.model(
  "Vendor",
  vendorSchema
);

export default Vendor;