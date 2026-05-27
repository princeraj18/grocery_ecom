import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  offerPrice: {
    type: Number,
    required: true,
  },

  stockQuantity: {
    type: Number,
    default: 0,
  },
});

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

    // Category Reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    variants: [variantSchema],

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