import jwt from "jsonwebtoken";

import DeliveryPartner
from "../models/DeliveryPartner.model.js";


export const protectDeliveryPartner =
  async (req, res, next) => {

    try {

      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith(
          "Bearer"
        )
      ) {

        token =
          req.headers.authorization.split(
            " "
          )[1];

        const decoded =
          jwt.verify(
            token,
            process.env.JWT_SECRET
          );

        const partner = await DeliveryPartner.findById(decoded.id).select("-password");

        // set both names so older controllers using `req.partner` still work
        req.deliveryPartner = partner;
        req.partner = partner;

        next();

      } else {

        return res.status(401).json({
          message:
            "Not authorized",
        });
      }

    } catch (error) {
      if (error && error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired",
          expiredAt: error.expiredAt,
        });
      }

      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };