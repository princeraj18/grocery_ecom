import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: [String],
      default: [],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],

    image: {
      type: [String],
      required: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export default Product;