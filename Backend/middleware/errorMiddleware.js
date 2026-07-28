/**
 * 404 Not Found Handler Middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid ID: ${err.value}`;
    statusCode = 400;
  }

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const keys = err.keyValue ? Object.keys(err.keyValue).join(", ") : "field";
    message = `Duplicate value entered for ${keys}`;
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Authorization denied.";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token has expired. Please log in again.";
    statusCode = 401;
  }

  console.error(`[Error] [${req.method} ${req.url}] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
