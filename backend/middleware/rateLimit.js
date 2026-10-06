const rateLimit = require("express-rate-limit");

// login / register — brute force rokta hai
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,      // 15 minutes
  max: process.env.NODE_ENV === "production" ? 8 : 100,                        // 8 attempts per IP
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,   // sirf failed attempts count hoti hain
});

// AI scans — mehngi hain, isliye limit zaroori
const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,      // 1 hour
  max: 20,                        // 20 scans per hour
  message: { message: "Scan limit reached. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// file uploads (receipts, licences)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { message: "Too many uploads. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// baaki sab routes ke liye general limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, scanLimiter, uploadLimiter, apiLimiter };