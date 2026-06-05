import DeliveryPartner from "../models/DeliveryPartner.model.js";
import Order from "../models/Order.model.js";

export const getDeliveryDashboard =
  async (req, res) => {

    try {

      // =====================================
      // DELIVERY PARTNERS
      // =====================================

      const totalPartners =
        await DeliveryPartner.countDocuments();

      const availablePartners =
        await DeliveryPartner.countDocuments({
          isAvailable: true,
        });

      const busyPartners =
        await DeliveryPartner.countDocuments({
          isAvailable: false,
        });

      // =====================================
      // EARNINGS
      // =====================================

      const earningsData =
        await DeliveryPartner.aggregate([
          {
            $group: {
              _id: null,

              totalEarnings: {
                $sum: "$totalEarnings",
              },

              walletBalance: {
                $sum: "$walletBalance",
              },

              withdrawnAmount: {
                $sum: "$withdrawnAmount",
              },
            },
          },
        ]);

      const totalEarnings =
        earningsData[0]
          ?.totalEarnings || 0;

      const walletBalance =
        earningsData[0]
          ?.walletBalance || 0;

      const withdrawnAmount =
        earningsData[0]
          ?.withdrawnAmount || 0;

      // =====================================
      // ORDERS
      // =====================================

      const totalOrders =
        await Order.countDocuments();

      const assignedOrders =
        await Order.countDocuments({
          deliveryStatus: {
            $in: [
              "Assigned",
              "Accepted",
              "Picked",
              "Out for Delivery",
            ],
          },
        });

      const activeDeliveries =
        assignedOrders;

      const completedDeliveries =
        await Order.countDocuments({
          deliveryStatus:
            "Delivered",
        });

      // =====================================
      // TOP DELIVERY PARTNERS
      // =====================================

      const topPartners =
        await DeliveryPartner.find()
          .sort({
            totalEarnings: -1,
          })
          .limit(5)
          .select(
            "name vehicleType totalEarnings"
          );

      // =====================================
      // RESPONSE
      // =====================================

      res.status(200).json({

        success: true,

        dashboard: {

          totalPartners,

          availablePartners,

          busyPartners,

          totalEarnings,

          walletBalance,

          withdrawnAmount,

          totalOrders,

          assignedOrders,

          activeDeliveries,

          completedDeliveries,

          topPartners,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };