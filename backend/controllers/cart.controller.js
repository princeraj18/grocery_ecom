import Cart from "../models/cart.model.js";

// ================= GET CART =================
export const getCart = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ADD TO CART =================
export const addToCart = async (
  req,
  res
) => {
  try {
    const { userId, product } =
      req.body;

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const existingItem =
      cart.items.find(
        (item) =>
          item.productId ===
          product.productId
      );

    if (existingItem) {
      existingItem.quantity +=
        product.quantity || 1;
    } else {
      cart.items.push(product);
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE CART =================
export const updateCart = async (
  req,
  res
) => {
  try {
    const {
      userId,
      productId,
      quantity,
    } = req.body;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (it) =>
        it.productId === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REMOVE FROM CART =================
export const removeFromCart =
  async (req, res) => {
    try {
      const { userId, productId } =
        req.body;

      const cart =
        await Cart.findOne({
          user: userId,
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Cart not found",
          });
      }

      cart.items = cart.items.filter(
        (item) =>
          item.productId !==
          productId
      );

      await cart.save();

      res.status(200).json({
        success: true,
        cart,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================= CLEAR CART =================
export const clearCart = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};