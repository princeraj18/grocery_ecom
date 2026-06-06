import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import Variant from "../models/Variant.model.js";
import mongoose from "mongoose";
import { cloudinary, isCloudAvailable } from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

// ==========================================
// CREATE PRODUCT
// ==========================================
export const createProduct = async (
  req,
  res
) => {
  try {

    // CHECK LOGIN
    if (!req.vendor) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // CHECK IMAGES
    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please upload images",
      });
    }

   const {
  name,
  description,
  category,
  price,
  offerPrice,
  stockQuantity
} = req.body;

console.log("CATEGORY RECEIVED:", category);
console.log("IS VALID OBJECT ID:", mongoose.Types.ObjectId.isValid(category));
if (
  !mongoose.Types.ObjectId.isValid(
    category
  )
) {
  return res.status(400).json({
    success: false,
    message: "Invalid category id",
  });
}

const categoryExists =
  await Category.findById(category);

if (!categoryExists) {
  return res.status(404).json({
    success: false,
    message: "Category not found",
  });
}

// PARSE AND CREATE VARIANTS
let variantIds = [];
const parsedVariants =
  JSON.parse(
    req.body.variants || "[]"
  );

if (parsedVariants.length > 0) {
  try {
    // Create variant documents from the submitted data
    const createdVariants =
      await Variant.insertMany(
        parsedVariants
      );
    
    // Extract variant IDs
    variantIds = createdVariants.map(
      (v) => v._id
    );
  } catch (variantError) {
    return res.status(400).json({
      success: false,
      message: "Error creating variants: " +
        variantError.message,
    });
  }
}

    // IMAGE URLS - upload buffers to Cloudinary with a local fallback
    const uploadToCloudinary = (buffer, filename) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "products", public_id: `${Date.now()}-${filename}` },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(buffer);
      });

    const uploadWithTimeout = (buffer, filename, ms = 30000) =>
      Promise.race([
        uploadToCloudinary(buffer, filename),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Cloudinary upload timeout")), ms)
        ),
      ]);

    const imageUrls = [];

    // If Cloudinary isn't available, skip uploads and save files locally
    if (!isCloudAvailable()) {
      console.log("Cloudinary not available - saving product images locally");
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      // Try unsigned upload if preset provided, otherwise save locally
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
      if (uploadPreset) {
        // attempt unsigned upload for each file
        for (const file of req.files) {
          const filename = file.originalname || file.filename || `file-${Date.now()}`;
          // read buffer from disk if needed
          const buffer = file.buffer || fs.readFileSync(file.path);
          try {
            
            const cloudName = process.env.CLOUD_NAME;
              const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
            const form = new FormData();
            form.append('file', buffer, filename);
            form.append('upload_preset', uploadPreset);

            const resp = await fetch(url, { method: 'POST', body: form });
            const json = await resp.json();
            if (!resp.ok) throw new Error(JSON.stringify(json));

            imageUrls.push(json.secure_url || json.url);
          } catch (e) {
            const safeName = `${Date.now()}-${(file.originalname || file.filename || "file").replace(/\s+/g, "-")}`;
            const filePath = path.join(uploadsDir, safeName);
            fs.writeFileSync(filePath, buffer);
            const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
            const urlLocal = `${base}/uploads/${safeName}`;
            imageUrls.push(urlLocal);
            console.warn("Unsigned Cloudinary upload failed, saved locally:", filePath, "error:", e.message || e);
          }
        }
      } else {
        for (const file of req.files) {
          const safeName = `${Date.now()}-${(file.originalname || file.filename || "file").replace(/\s+/g, "-")}`;
          const filePath = path.join(uploadsDir, safeName);
          const buffer = file.buffer || fs.readFileSync(file.path);
          fs.writeFileSync(filePath, buffer);

          const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
          const url = `${base}/uploads/${safeName}`;
          imageUrls.push(url);
        }
      }
    } else {
      for (const file of req.files) {
        try {
          const buffer = file.buffer || fs.readFileSync(file.path);
          const result = await uploadWithTimeout(
            buffer,
            file.originalname || file.filename
          );

          imageUrls.push(result.secure_url || result.url || "");
        } catch (err) {
          // Fallback: save to local uploads/ and serve from /uploads
          const uploadsDir = path.join(process.cwd(), "uploads");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const safeName = `${Date.now()}-${(file.originalname || file.filename || "file").replace(/\s+/g, "-")}`;
          const buffer = file.buffer || fs.readFileSync(file.path);
          const filePath = path.join(uploadsDir, safeName);
          fs.writeFileSync(filePath, buffer);

          const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
          const url = `${base}/uploads/${safeName}`;

          imageUrls.push(url);

          console.warn("Cloudinary upload failed, saved locally:", filePath, "error:", err.message || err);
        }
      }
    }

    // CREATE PRODUCT
  // If variants were provided, compute total stock from variants
  let computedStock = 0;
  if (parsedVariants && parsedVariants.length > 0) {
    computedStock = parsedVariants.reduce((sum, v) => {
      return (
        sum +
        Number(
          v?.stockQuantity ?? v?.stock ?? v?.quantity ?? 0
        )
      );
    }, 0);
  }

  const product = await Product.create({
  vendor: req.vendor._id,
  name,
  description: [description],
  category,
  price: Number(price) || 0,
  offerPrice: Number(offerPrice) || 0,
  stockQuantity:
    computedStock || Number(stockQuantity) || 0,
  variants: variantIds,
  image: imageUrls,
  inStock:
    (computedStock > 0) || (Number(stockQuantity) > 0),
  bestseller: false,
});

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });

  } catch (error) {

    console.log(
      "CREATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================
export const getProducts = async (
  req,
  res
) => {
  try {

 const products = await Product.find()
  .populate(
    "vendor",
    "shopName ownerName isVerified"
  )
  .populate(
    "category",
    "text image bgColor"
  )
  .populate(
    "variants",
    "size price offerPrice stockQuantity"
  )
  .sort({
    createdAt: -1,
  });

    // Compute stock totals from variants for each product before returning
    const productsWithStock = products.map((p) => {
      const obj = p.toObject ? p.toObject() : p;
      const variantStockSum = (obj.variants || []).reduce((t, v) => {
        return t + Number(v?.stockQuantity ?? v?.stock ?? v?.quantity ?? 0);
      }, 0);

      if (variantStockSum > 0) {
        obj.stockQuantity = variantStockSum;
        obj.inStock = true;
      } else {
        obj.inStock = Boolean(obj.stockQuantity > 0);
      }

      return obj;
    });

    res.status(200).json({
      success: true,
      products: productsWithStock,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET VENDOR PRODUCTS
// ==========================================
// ==========================================
// GET VENDOR PRODUCTS
// ==========================================
export const getVendorProducts =
  async (req, res) => {

    try {

      const products = await Product.find({
  vendor: req.vendor._id,
})
  .populate(
    "category",
    "text image bgColor"
  )
  .populate(
    "variants",
    "size price offerPrice stockQuantity"
  )
  .sort({
    createdAt: -1,
  });

      // Compute stock totals from variants for vendor products
      const productsWithStock = products.map((p) => {
        const obj = p.toObject ? p.toObject() : p;
        const variantStockSum = (obj.variants || []).reduce((t, v) => {
          return t + Number(v?.stockQuantity ?? v?.stock ?? v?.quantity ?? 0);
        }, 0);

        if (variantStockSum > 0) {
          obj.stockQuantity = variantStockSum;
          obj.inStock = true;
        } else {
          obj.inStock = Boolean(obj.stockQuantity > 0);
        }

        return obj;
      });

      res.status(200).json({
        success: true,
        products: productsWithStock,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
export const getSingleProduct =
  async (req, res) => {

    try {

      // Validate product id to avoid CastError
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
      }
const product = await Product.findById(
  req.params.id
)
  .populate(
    "vendor",
    "shopName ownerName isVerified"
  )
  .populate(
    "category",
    "text image bgColor"
  )
  .populate(
    "variants",
    "size price offerPrice stockQuantity"
  );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      // Compute stock from variants for single product
      const prodObj = product.toObject ? product.toObject() : product;
      const variantStockSum = (prodObj.variants || []).reduce((t, v) => {
        return t + Number(v?.stockQuantity ?? v?.stock ?? v?.quantity ?? 0);
      }, 0);

      if (variantStockSum > 0) {
        prodObj.stockQuantity = variantStockSum;
        prodObj.inStock = true;
      } else {
        prodObj.inStock = Boolean(prodObj.stockQuantity > 0);
      }

      res.status(200).json({
        success: true,
        product: prodObj,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ==========================================
// UPDATE PRODUCT
// ==========================================
export const updateProduct =
  async (req, res) => {

    try {

      // Validate product id to avoid CastError
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
      }

      const product = await Product.findById(
        req.params.id
      );

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      // CHECK OWNER
      if (
        product.vendor.toString() !==
        req.vendor._id.toString()
      ) {

        return res.status(403).json({
          success: false,
          message:
            "You can update only your products",
        });
      }

      // UPDATE FIELDS
      product.name =
        req.body.name ||
        product.name;

      if (req.body.category) {
  const categoryExists =
    await Category.findById(
      req.body.category
    );

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  product.category =
    req.body.category;
}

      if (req.body.price !== undefined) {
        product.price = Number(req.body.price);
      }

      if (req.body.offerPrice !== undefined) {
        product.offerPrice = Number(req.body.offerPrice);
      }

      if (req.body.variants) {
  const parsedVariants = JSON.parse(
    req.body.variants
  );

  const variantIds = [];

  for (const variant of parsedVariants) {
    const variantData = {
      size: variant.size,
      price: Number(variant.price) || 0,
      offerPrice:
        Number(variant.offerPrice) || 0,
      stockQuantity:
        Number(variant.stockQuantity) || 0,
    };

    if (
      variant._id &&
      mongoose.Types.ObjectId.isValid(
        variant._id
      )
    ) {
      const updatedVariant =
        await Variant.findByIdAndUpdate(
          variant._id,
          variantData,
          {
            new: true,
            runValidators: true,
          }
        );

      if (updatedVariant) {
        variantIds.push(
          updatedVariant._id
        );
      }
    } else {
      const createdVariant =
        await Variant.create(
          variantData
        );

      variantIds.push(
        createdVariant._id
      );
    }
  }

  product.variants = variantIds;
  product.stockQuantity =
    parsedVariants.reduce(
      (total, variant) =>
        total +
        Number(
          variant.stockQuantity || 0
        ),
      0
    );
  product.inStock =
    product.stockQuantity > 0;
}
      product.inStock =
        req.body.inStock ??
        product.inStock;

      // DESCRIPTION
      if (req.body.description) {

        product.description = [
          req.body.description,
        ];
      }

      // UPDATE IMAGES
      if (req.files && req.files.length > 0) {
        // reuse upload logic: upload buffers to Cloudinary with fallback
        const newImageUrls = [];

        for (const file of req.files) {
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "products", public_id: `${Date.now()}-${file.originalname}` },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result);
                }
              );

              stream.end(file.buffer);
            });

            newImageUrls.push(uploadResult.secure_url || uploadResult.url || "");
          } catch (err) {
            // fallback local
            const uploadsDir = path.join(process.cwd(), "uploads");
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

            const safeName = `${Date.now()}-${(file.originalname || file.filename || "file").replace(/\s+/g, "-")}`;
            const filePath = path.join(uploadsDir, safeName);
            fs.writeFileSync(filePath, file.buffer);

            const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
            newImageUrls.push(`${base}/uploads/${safeName}`);
          }
        }

        product.image = newImageUrls;
      }
if (
  req.body.stockQuantity !==
  undefined
) {
  product.stockQuantity =
    Number(req.body.stockQuantity);

  product.inStock =
    product.stockQuantity > 0;
}
      await product.save();

      // Populate variants before returning
      await product.populate(
        "variants",
        "size price offerPrice stockQuantity"
      );

      // Compute stock from populated variants
      const prodObj = product.toObject ? product.toObject() : product;
      const variantStockSum = (prodObj.variants || []).reduce((t, v) => {
        return t + Number(v?.stockQuantity ?? v?.stock ?? v?.quantity ?? 0);
      }, 0);

      if (variantStockSum > 0) {
        prodObj.stockQuantity = variantStockSum;
        prodObj.inStock = true;
      } else {
        prodObj.inStock = Boolean(prodObj.stockQuantity > 0);
      }

      res.status(200).json({
        success: true,
        message:
          "Product updated successfully",
        product: prodObj,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ==========================================
// DELETE PRODUCT
// ==========================================
export const deleteProduct =
  async (req, res) => {

    try {

      // Validate product id to avoid CastError
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
      }

      const product = await Product.findById(
        req.params.id
      );

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      // CHECK OWNER
      if (
        product.vendor.toString() !==
        req.vendor._id.toString()
      ) {

        return res.status(403).json({
          success: false,
          message:
            "You can delete only your products",
        });
      }

      await product.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Product deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  export const reduceProductStock =
  async (
    productId,
    quantity
  ) => {

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    if (
      product.stockQuantity <
      quantity
    ) {
      throw new Error(
        "Insufficient stock"
      );
    }

    product.stockQuantity -=
      quantity;

    product.inStock =
      product.stockQuantity > 0;

    await product.save();

    return product;
  };

export const updateInventoryStock =
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
      }

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      if (
        product.vendor.toString() !==
        req.vendor._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can update only your products",
        });
      }

      const variants =
        Array.isArray(
          req.body.variants
        )
          ? req.body.variants
          : [];

      if (variants.length === 0) {
        const stockQuantity =
          Math.max(
            0,
            Number(
              req.body.stockQuantity
            ) || 0
          );

        product.stockQuantity =
          stockQuantity;
        product.inStock =
          stockQuantity > 0;

        await product.save();
      } else {
        for (const item of variants) {
          if (
            !item._id ||
            !mongoose.Types.ObjectId.isValid(
              item._id
            )
          ) {
            continue;
          }

          const belongsToProduct =
            product.variants.some(
              (variantId) =>
                variantId.toString() ===
                item._id.toString()
            );

          if (!belongsToProduct) {
            continue;
          }

          await Variant.findByIdAndUpdate(
            item._id,
            {
              stockQuantity:
                Math.max(
                  0,
                  Number(
                    item.stockQuantity
                  ) || 0
                ),
            },
            {
              runValidators: true,
            }
          );
        }

        const updatedVariants =
          await Variant.find({
            _id: {
              $in: product.variants,
            },
          });

        product.stockQuantity =
          updatedVariants.reduce(
            (total, variant) =>
              total +
              Number(
                variant.stockQuantity ||
                  0
              ),
            0
          );
        product.inStock =
          product.stockQuantity > 0;

        await product.save();
      }

      const updatedProduct =
        await Product.findById(
          product._id
        )
          .populate(
            "category",
            "text image bgColor"
          )
          .populate(
            "variants",
            "size price offerPrice stockQuantity"
          );

      res.status(200).json({
        success: true,
        message:
          "Inventory updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.log(
        "UPDATE INVENTORY ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
