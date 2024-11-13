// NOTE: Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

// NOTE: Custom error response class
export const asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// NOTE: Custom error response class
export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// USAGE: For using the error handler middleware, you need to import it in the app.js file and mount it as a middleware. (Already done in the app.js file)

// USAGE: For using the custom error response class, you need to import it in the controller file and use it to throw an error.
// Example: return next(new ErrorResponse("No users found", 404));

// USAGE: For using the async error handler, you need to import it in the controller file and wrap the controller function with it.
// Example: exports.getUsers = asyncErrorHandler(async (req, res, next) => {
//   const users = await User.find();
//   if (!users) {
//      return next(new ErrorResponse("No users found", 404));
//   }
//   return res.status(200).json({ success: true, data: users });
// });
