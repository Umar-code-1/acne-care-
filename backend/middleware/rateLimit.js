const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = rateLimit;
const { createHash } = require("crypto");
const jwt = require("jsonwebtoken");

const isProduction = () => process.env.NODE_ENV === "production";
const skipRateLimit = () => !isProduction();
const ipKey = (req) => `ip:${ipKeyGenerator(req.ip || "", 56)}`;
const accountKey = (value) => `account:${createHash("sha256").update(value).digest("hex")}`;

const authKeyGenerator = (req) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  return email ? accountKey(email) : ipKey(req);
};

const apiKeyGenerator = (req) => {
  const token = (req.headers.authorization || "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (token && process.env.JWT_SECRET) {
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (id) return `user:${id}`;
    } catch {
      // Invalid or expired tokens share the anonymous IP bucket.
    }
  }
  return ipKey(req);
};

const userOrIpKeyGenerator = (req) =>
  req.user?._id ? `user:${req.user._id}` : ipKey(req);

// Production login protection is per account, so users behind one IP do not block each other.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,      // 15 minutes
  max: 5,                         // failed attempts per account before the next request is blocked
  keyGenerator: authKeyGenerator,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,   // sirf failed attempts count hoti hain
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 100,
  keyGenerator: authKeyGenerator,
  message: { message: "Too many password reset requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipRateLimit,
});

// AI scans — mehngi hain, isliye limit zaroori
const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,      // 1 hour
  max: 20,                        // 20 scans per hour
  keyGenerator: userOrIpKeyGenerator,
  message: { message: "Scan limit reached. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipRateLimit,
});

// file uploads (receipts, licences)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  keyGenerator: userOrIpKeyGenerator,
  message: { message: "Too many uploads. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipRateLimit,
});

// Production API limit is per authenticated user, not shared across a household or office IP.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  keyGenerator: apiKeyGenerator,
  message: { message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => skipRateLimit(req)
    || /^\/api\/auth\/(login|register)(?:\?|$)/.test(req.originalUrl)
    || (req.method === "PUT" && req.originalUrl.split("?")[0] === "/api/auth/profile"),
});

module.exports = { authLimiter, passwordResetLimiter, scanLimiter, uploadLimiter, apiLimiter };
