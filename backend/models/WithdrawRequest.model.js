import mongoose from "mongoose";

const withdrawRequestSchema =
  new mongoose.Schema({

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },

  },
  {
    timestamps: true,
  });

const WithdrawRequest =
  mongoose.models.WithdrawRequest ||
  mongoose.model(
    "WithdrawRequest",
    withdrawRequestSchema
  );

export default WithdrawRequest;