import WithdrawRequest from "../models/WithdrawRequest.model.js";

const PARTNER_FIELDS =
  "name email phone address profileImage vehicleType vehicleNumber walletBalance totalEarnings withdrawnAmount isAvailable";

const buildSummary = (requests) => {
  const summary = {
    totalRequests: requests.length,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    rejectedAmount: 0,
  };

  requests.forEach((request) => {
    const amount = request.amount || 0;

    if (request.status === "Pending") {
      summary.pendingCount += 1;
      summary.pendingAmount += amount;
    } else if (request.status === "Approved") {
      summary.approvedCount += 1;
      summary.approvedAmount += amount;
    } else if (request.status === "Rejected") {
      summary.rejectedCount += 1;
      summary.rejectedAmount += amount;
    }
  });

  return summary;
};

// =======================================
// GET ALL WITHDRAW REQUESTS (ADMIN)
// =======================================
export const getAllWithdrawRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
      filter.status = status;
    }

    const withdrawRequests = await WithdrawRequest.find(filter)
      .populate("partner", PARTNER_FIELDS)
      .sort({ createdAt: -1 })
      .lean();

    const summary = buildSummary(withdrawRequests);

    res.status(200).json({
      success: true,
      summary,
      withdrawRequests,
    });
  } catch (error) {
    console.log("GET WITHDRAW REQUESTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// GET SINGLE WITHDRAW REQUEST (ADMIN)
// =======================================
export const getWithdrawRequestById = async (req, res) => {
  try {
    const withdrawRequest = await WithdrawRequest.findById(req.params.id)
      .populate("partner", PARTNER_FIELDS)
      .lean();

    if (!withdrawRequest) {
      return res.status(404).json({
        success: false,
        message: "Withdraw request not found",
      });
    }

    res.status(200).json({
      success: true,
      withdrawRequest,
    });
  } catch (error) {
    console.log("GET WITHDRAW REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// APPROVE WITHDRAW REQUEST (ADMIN)
// =======================================
export const approveWithdrawRequest = async (req, res) => {
  try {
    const request = await WithdrawRequest.findById(req.params.id).populate(
      "partner"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Withdraw request not found",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    const partner = request.partner;

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    if (partner.walletBalance < request.amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    partner.walletBalance -= request.amount;
    partner.withdrawnAmount += request.amount;

    await partner.save();

    request.status = "Approved";
    await request.save();

    const updatedRequest = await WithdrawRequest.findById(request._id)
      .populate("partner", PARTNER_FIELDS)
      .lean();

    res.status(200).json({
      success: true,
      message: "Withdraw approved successfully",
      withdrawRequest: updatedRequest,
    });
  } catch (error) {
    console.log("APPROVE WITHDRAW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// REJECT WITHDRAW REQUEST (ADMIN)
// =======================================
export const rejectWithdrawRequest = async (req, res) => {
  try {
    const request = await WithdrawRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Withdraw request not found",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    request.status = "Rejected";
    await request.save();

    const updatedRequest = await WithdrawRequest.findById(request._id)
      .populate("partner", PARTNER_FIELDS)
      .lean();

    res.status(200).json({
      success: true,
      message: "Withdraw request rejected",
      withdrawRequest: updatedRequest,
    });
  } catch (error) {
    console.log("REJECT WITHDRAW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
