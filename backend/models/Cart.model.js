import mongoose from "mongoose";

const cartItemSchema =
  new mongoose.Schema(
    {
      productId: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      image: {
        type: String,
      },

      category: {
        type: String,
      },

      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        default: 1,
      },
    },
    { _id: false }
  );

const cartSchema =
  new mongoose.Schema(
    {
      user: {
        type: String,
        required: true,
        unique: true,
      },

      items: [cartItemSchema],
    },
    {
      timestamps: true,
    }
  );

const Cart = mongoose.model(
  "Cart",
  cartSchema
);

export default Cart;