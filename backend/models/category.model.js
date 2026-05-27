import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    bgColor: {
      type: String,
      default: "#FFFFFF",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);

export default Category;