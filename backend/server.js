const express   = require("express");
const cors      = require("cors");
const dotenv    = require("dotenv");
const path      = require("path");
const mongoose  = require("mongoose");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimit");
dotenv.config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// uploaded images ko public serve karo
app.use("/api", apiLimiter);

// Database abhi connect nahi hua to saaf message bhejo (request hang na ho)
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "The server is starting up or can't reach the database. Please try again in a few seconds.",
    });
  }
  next();
});

app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/scans",        require("./routes/scanRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/messages",      require("./routes/messageRoutes"));

app.use("/api/users",         require("./routes/userRoutes"));

app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/platform-fees", require("./routes/platformFeeRoutes"));

app.use("/api/diet", require("./routes/dietRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "AcneCare API running" });
});

// multer + baaki errors ka handler
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image too large. Maximum size is 5MB." });
  }
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
// Server foran start karo; MongoDB background mein connect (aur retry) hota rahega
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
connectDB();

// Free hosting: wake the AI model as soon as the backend wakes, so it is
// usually ready by the time the user reaches the scan screen.
require("./controllers/scanController").wakeModel();
