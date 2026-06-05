import WithdrawRequest from "../models/WithdrawRequest.model.js";
import DeliveryPartner from "../models/DeliveryPartner.model.js";

// =======================================
// CREATE WITHDRAW REQUEST
// =======================================

export const createWithdrawRequest =
  async (req, res) => {

    try {

      const { amount } = req.body;

      // ===================================
      // VALIDATE AMOUNT
      // ===================================

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter valid amount",
        });
      }

      // ===================================
      // FIND PARTNER
      // ===================================

      const partner =
        await DeliveryPartner.findById(
          req.deliveryPartner._id
        );

      if (!partner) {
        return res.status(404).json({
          success: false,
          message:
            "Delivery Partner not found",
        });
      }

      // ===================================
      // CHECK BALANCE
      // ===================================

      if (
        amount > partner.walletBalance
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Insufficient wallet balance",
        });
      }

      // ===================================
      // CREATE REQUEST
      // ===================================

      const request =
        await WithdrawRequest.create({
          partner: partner._id,
          amount,
        });

      res.status(201).json({
        success: true,
        message:
          "Withdraw request submitted",
        request,
      });

    } catch (error) {

      console.log(
        "WITHDRAW ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
