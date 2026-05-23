import jwt from "jsonwebtoken";

// =====================================
// ADMIN AUTH MIDDLEWARE
// =====================================
export const protectAdmin =
  async (req, res, next) => {
    try {
      let token;

      // GET TOKEN
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
      }

      // NO TOKEN
      if (!token) {
        return res.status(401).json({
          success: false,
          message:
            "Not authorized",
        });
      }

      // VERIFY TOKEN
      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      req.admin = decoded;

      next();
    } catch (error) {
      console.log(
        "ADMIN AUTH ERROR:",
        error
      );

      res.status(401).json({
        success: false,
        message:
          "Token failed",
      });
    }
  };