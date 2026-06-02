import mongoose from "mongoose";

const contactSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
      },

      subject: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      adminReply: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Resolved",
        ],
        default: "Pending",
      },
    },
    {
      timestamps: true,
    }
  );

const Contact = mongoose.model(
  "Contact",
  contactSchema
);

export default Contact;