import { asyncErrorHandler, ErrorResponse } from "../middleware/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/user.js";
import { sendMail } from "../utils/services/mail-service.js";
import { caches } from "../config/cache.js";
import { genrateCustomizedUserId } from "../utils/customized-id.js";
import fs from "fs";

// Helper function to remove null or undefined values from request body
const removeNullUndefined = (req) => {
  Object.keys(req.body).forEach(
    (key) =>
      (req.body[key] == null || req.body[key] == undefined) &&
      delete req.body[key]
  );
  return req.body;
};

// Register User
export const registerUser = asyncErrorHandler(async (req, res, next) => {
  const data = removeNullUndefined(req);

  const searchCriteria = [
    {
      email: {
        $regex: new RegExp(data.email, "i"),
      },
    },
  ];

  if (data.phone) {
    searchCriteria.push({
      phone: {
        $regex: new RegExp(data.phone, "i"),
      },
    });
  }

  const existingOperator = await User.findOne({
    $or: searchCriteria,
  });

  if (existingOperator) {
    return next(new ErrorResponse("User already exists", 400));
  }

  const encryptedPassword = bcrypt.hashSync(
    data.password,
    parseInt(process.env.PASSWORD_SALT)
  );

  const _id = await genrateCustomizedUserId();

  const userData = {
    ...data,
    password: encryptedPassword,
    _id,
  };

  if (!userData.phone) {
    delete userData.phone;
  }

  const newUser = await User.create(userData);

  return res.status(201).json({
    success: true,
    message: "User created successfully. Please contact admin for verification",
    data: newUser,
  });
});

// User Login
export const userLogin = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("User not found!", 401));
  }

  if (!user.verified) {
    return next(new ErrorResponse("User not verified!", 401));
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const payload = {
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  req.session.jwt = token; // Store JWT in the session

  user.password = undefined; // Hide password in response
  return res.status(200).json({
    success: true,
    data: user,
  });
});

// Get Profile
export const getProfile = asyncErrorHandler(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

// Logout
export const logout = asyncErrorHandler(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new ErrorResponse("Logout failed", 500));
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

// Forget Password
export const forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  caches.set(email, token, 600);

  let htmlContent = fs.readFileSync(
    "./utils/mail-body/password-reset-mail.html",
    "utf8"
  );
  htmlContent = htmlContent.replace(/\$\{userName\}/g, user.fullName);
  htmlContent = htmlContent.replace(/\$\{url\}/g, url);
  await sendMail({
    from: process.env.MAIL_ID,
    to: user.email,
    subject: "Reset Password",
    html: htmlContent,
  });
  return res.status(200).json({
    success: true,
    message: "Password reset link sent to your email",
  });
});

export const resendPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const tokenDuration = 2 * 60;
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: `${tokenDuration}s`,
  });

  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  caches.set(email, token, tokenDuration);

  let htmlContent = fs.readFileSync(
    "./utils/mail-body/password-reset-mail.html",
    "utf8"
  );
  htmlContent = htmlContent.replace(/\$\{userName\}/g, user.fullName);
  htmlContent = htmlContent.replace(/\$\{url\}/g, url);
  await sendMail({
    from: process.env.MAIL_ID,
    to: user.email,
    subject: "Reset Password",
    html: htmlContent,
  });

  return res.status(200).json({
    success: true,
    message: "Password reset link sent to your email",
    duration: `${tokenDuration / 60} minutes`,
  });
});

// Reset Password
export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  let email;
  try {
    ({ email } = jwt.verify(token, process.env.JWT_SECRET));
  } catch (error) {
    return next(new ErrorResponse("Invalid or expired token", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const encryptedPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.PASSWORD_SALT)
  );
  await User.updateOne({ email }, { password: encryptedPassword });

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// Change Password
export const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { email } = req.user;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const isPasswordMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isPasswordMatch) {
    return next(new ErrorResponse("Invalid old password", 400));
  }

  const encryptedPassword = bcrypt.hashSync(
    newPassword,
    parseInt(process.env.PASSWORD_SALT)
  );
  await User.updateOne({ email }, { password: encryptedPassword });

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// Update User
export const updateUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { avatarUrl, fullName, email, phone } = req.body;

  if (!fullName || !email || !phone) {
    return next(new ErrorResponse("Please fill all required fields", 400));
  }

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      avatarUrl,
      fullName,
      email,
      phone,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

// Delete User
export const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const deletedUser = await User.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});
