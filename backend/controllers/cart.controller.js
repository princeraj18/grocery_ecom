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

    // CHECK BOTH PRODUCT + VARIANT
    const existingItem =
      cart.items.find(
        (item) =>
          item.productId.toString() ===
            product.productId.toString() &&
          item.variantSize ===
            product.variantSize
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
      variantSize,
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
        it.productId.toString() ===
          productId.toString() &&
        it.variantSize ===
          variantSize
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

      const {
        userId,
        productId,
        variantSize,
      } = req.body;

      const cart =
        await Cart.findOne({
          user: userId,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            !(
              item.productId.toString() ===
                productId.toString() &&
              item.variantSize ===
                variantSize
            )
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
    const { userId } = req.body;

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

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};