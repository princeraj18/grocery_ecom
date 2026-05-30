import Product from "../models/Product.model.js";
import Variant from "../models/Variant.model.js";

export const getVariantStock = async (
  product,
  item
) => {
  if (!product) return null;

  const variantId =
    item.variant || item.variantId;

  if (variantId) {
    const variant =
      await Variant.findById(variantId);

    if (variant) return variant;
  }

  const variantSize =
    item.variantSize || item.size;

  if (!variantSize) return null;

  return Variant.findOne({
    _id: {
      $in: product.variants || [],
    },
    size: variantSize,
  });
};

export const reduceOrderStock = async (
  order
) => {
  if (!order || order.stockReduced) {
    return;
  }

  const productQuantities = new Map();
  const variantQuantities = new Map();

  for (const item of order.items || []) {
    if (!item.product) continue;

    const product =
      await Product.findById(item.product);

    if (!product) {
      throw new Error(
        `${item.name || "Product"} not found`
      );
    }

    const quantity =
      Number(item.quantity || 0);

    const variant =
      await getVariantStock(product, item);

    if (variant) {
      const variantKey =
        variant._id.toString();

      variantQuantities.set(
        variantKey,
        {
          variant,
          productName: product.name,
          quantity:
            (variantQuantities.get(
              variantKey
            )?.quantity || 0) +
            quantity,
        }
      );
    }

    const productKey =
      product._id.toString();

    productQuantities.set(
      productKey,
      {
        product,
        quantity:
          (productQuantities.get(
            productKey
          )?.quantity || 0) +
          quantity,
      }
    );
  }

  for (const {
    variant,
    productName,
    quantity,
  } of variantQuantities.values()) {
    if (
      Number(variant.stockQuantity) <
      quantity
    ) {
      throw new Error(
        `${productName} (${variant.size}) has only ${variant.stockQuantity} items left in stock`
      );
    }

    variant.stockQuantity -= quantity;
    await variant.save();
  }

  for (const {
    product,
    quantity,
  } of productQuantities.values()) {
    if (
      Number(product.stockQuantity) <
      quantity
    ) {
      throw new Error(
        `${product.name} has only ${product.stockQuantity} items left in stock`
      );
    }

    product.stockQuantity -= quantity;
    product.inStock =
      product.stockQuantity > 0;
    await product.save();
  }

  order.stockReduced = true;
  await order.save();
};

export const validateOrderStock = async (
  items
) => {
  const productQuantities = new Map();
  const variantQuantities = new Map();

  for (const item of items || []) {
    if (!item.product) continue;

    const product =
      await Product.findById(item.product);

    if (!product) {
      throw new Error(
        `${item.name || "Product"} not found`
      );
    }

    const quantity =
      Number(item.quantity || 0);

    const variant =
      await getVariantStock(product, item);

    if (variant) {
      const variantKey =
        variant._id.toString();

      variantQuantities.set(
        variantKey,
        {
          variant,
          productName: product.name,
          quantity:
            (variantQuantities.get(
              variantKey
            )?.quantity || 0) +
            quantity,
        }
      );
    }

    const productKey =
      product._id.toString();

    productQuantities.set(
      productKey,
      {
        product,
        quantity:
          (productQuantities.get(
            productKey
          )?.quantity || 0) +
          quantity,
      }
    );
  }

  for (const {
    variant,
    productName,
    quantity,
  } of variantQuantities.values()) {
    if (
      Number(variant.stockQuantity) <
      quantity
    ) {
      throw new Error(
        `${productName} (${variant.size}) has only ${variant.stockQuantity} items left in stock`
      );
    }
  }

  for (const {
    product,
    quantity,
  } of productQuantities.values()) {
    if (
      Number(product.stockQuantity) <
      quantity
    ) {
      throw new Error(
        `${product.name} has only ${product.stockQuantity} items left in stock`
      );
    }
  }
};
