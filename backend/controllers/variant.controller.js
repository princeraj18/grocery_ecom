import Variant from "../models/Variant.model.js";

// CREATE VARIANT
export const createVariant =
  async (req, res) => {
    try {
      const {
        size,
       
      } = req.body;

      const variant =
        await Variant.create({
          size,
         
        });

      res.status(201).json({
        success: true,
        message:
          "Variant created successfully",
        variant,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// GET ALL VARIANTS
export const getVariants =
  async (req, res) => {
    try {
      const variants =
        await Variant.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        variants,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// DELETE VARIANT
export const deleteVariant =
  async (req, res) => {
    try {
      await Variant.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Variant deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };