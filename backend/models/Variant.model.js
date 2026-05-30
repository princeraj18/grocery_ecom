import mongoose from "mongoose";

const variantSchema =
  new mongoose.Schema(
    {
      size: {
        type: String,
        required: true,
        trim: true,
      },

      price: {
        type: Number,
        
        min: 0,
      },

      offerPrice: {
        type: Number,
        
        min: 0,
      },

      stockQuantity: {
        type: Number,
        
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const Variant =
  mongoose.models.Variant ||
  mongoose.model(
    "Variant",
    variantSchema
  );

export default Variant;