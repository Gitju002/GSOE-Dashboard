import jwt from "jsonwebtoken";
import { User } from "../model/user.js";

class Auth {
  #admin = "ADMIN";
  #operator = "OPERATOR";
  #accounts = "ACCOUNTS";

  constructor() {
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isOperator = this.isOperator.bind(this);
    this.isAccounts = this.isAccounts.bind(this);
  }

  async isAuthenticated(req, res, next) {
    const token = req.session.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        email: decoded.email,
        verified: true,
      }).select("-password");
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  }
  isAdmin(req, res, next) {
    if (req.user.role === this.#admin) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
  isOperator(req, res, next) {
    if (req.user.role === this.#accounts) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    if (req.user.role === this.#operator || req.user.role === this.#admin) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
  isAccounts(req, res, next) {
    if (req.user.role === this.#operator) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    if (req.user.role === this.#admin || req.user.role === this.#accounts) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
}

export default new Auth();
