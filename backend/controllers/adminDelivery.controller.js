import DeliveryPartner from "../models/DeliveryPartner.model.js";
import Order from "../models/Order.model.js";

// ======================================
// ADMIN: DELIVERY PARTNERS DASHBOARD
// ======================================
export const getDeliveryPartnersDashboard =
  async (req, res) => {
    try {
      const partners = await DeliveryPartner.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

      const totalPartners = partners.length;

      const availablePartners = partners.filter(
        (partner) => partner.isAvailable
      ).length;

      const busyPartners = partners.filter(
        (partner) => !partner.isAvailable
      ).length;

      const totalEarnings = partners.reduce(
        (acc, partner) => acc + (partner.totalEarnings || 0),
        0
      );

      const totalWalletBalance = partners.reduce(
        (acc, partner) => acc + (partner.walletBalance || 0),
        0
      );

      const totalWithdrawn = partners.reduce(
        (acc, partner) => acc + (partner.withdrawnAmount || 0),
        0
      );

      const activeDeliveries = await Order.countDocuments({
        deliveryStatus: {
          $in: [
            "Assigned",
            "Accepted",
            "Picked",
            "Out for Delivery",
          ],
        },
      });

      const completedDeliveries = await Order.countDocuments({
        deliveryStatus: "Delivered",
      });

      res.status(200).json({
        success: true,
        stats: {
          totalPartners,
          availablePartners,
          busyPartners,
          totalEarnings,
          totalWalletBalance,
          totalWithdrawn,
          activeDeliveries,
          completedDeliveries,
        },
        partners,
      });
    } catch (error) {
      console.log("DELIVERY DASHBOARD ERROR:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// ADMIN: GET SINGLE DELIVERY PARTNER
// ======================================
export const getDeliveryPartner = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await DeliveryPartner.findById(id)
      .select("-password")
      .lean();

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    res.status(200).json({ success: true, partner });
  } catch (error) {
    console.log("GET PARTNER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
