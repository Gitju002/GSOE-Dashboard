import express from "express";
import {
  userLogin,
  getProfile,
  logout,
  registerUser,
  forgetPassword,
  resetPassword,
  changePassword,
  updateUser,
  deleteUser,
  resendPassword, // Added the resendPassword controller function
} from "../controller/user.js";
import {
  registerUserValidation,
  userLoginValidation,
} from "../middleware/validation/user-validation.js";
import auth from "../auth/auth.js";

const app = express.Router();

// Public routes
app.post("/register", registerUserValidation, registerUser);
app.post("/login", userLoginValidation, userLogin);
app.post("/forgot-password", forgetPassword);
app.post("/resend-password", resendPassword);
app.post("/reset-password/:token", resetPassword);

app.get("/profile", auth.isAuthenticated, getProfile);
app.get("/logout", auth.isAuthenticated, logout);
app.post("/change-password", auth.isAuthenticated, changePassword);
app.put("/update/:id", auth.isAuthenticated, updateUser);
app.delete("/delete/:id", auth.isAuthenticated, auth.isAdmin, deleteUser);

export default app;
