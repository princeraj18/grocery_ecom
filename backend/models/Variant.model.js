import mongoose from "mongoose";

const variantSchema =
  new mongoose.Schema(
    {
      size: {
        type: String,
        required: true,
        unique:true,
        trim: true,
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