const Appointment = require("../models/Appointment");
const path = require("path");
const fs = require("fs");


// GET /api/payments/details
// GET /api/payments/:id/details   — is appointment ke doctor ki bank details
const getPaymentDetails = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate("doctor");
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    if (appt.patient.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const d = appt.doctor;
    if (!d?.accountNumber && !d?.jazzcash && !d?.easypaisa) {
      return res.status(400).json({
        message: "This doctor hasn't added payment details yet. Please contact support.",
      });
    }

    res.json({
      doctorName:    d.name,
      bankName:      d.bankName,
      accountTitle:  d.accountTitle,
      accountNumber: d.accountNumber,
      iban:          d.iban,
      jazzcash:      d.jazzcash,
      easypaisa:     d.easypaisa,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST /api/payments/:id/proof   (patient uploads screenshot)
const submitProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload your payment receipt" });
    }

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    if (appt.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your appointment" });
    }
    if (appt.paymentStatus === "paid") {
      return res.status(400).json({ message: "This appointment is already paid" });
    }

    appt.paymentProof   = `/uploads/payments/${req.file.filename}`;
    appt.transactionRef = (req.body.transactionRef || "").trim();
    appt.paymentStatus  = "pending_verification";
    appt.paymentNote    = "";
    await appt.save();

    res.json({
      message: "Receipt submitted. We'll verify within a few hours.",
      paymentStatus: appt.paymentStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/pending   (admin queue)
const getPendingPayments = async (req, res) => {
  try {
    const filter = { paymentStatus: "pending_verification" };
    if (req.user.role === "dermatologist") filter.doctor = req.user._id;

    const list = await Appointment.find(filter)
      .populate("patient", "name email phone")
      .populate("doctor", "name spec")
      .sort({ updatedAt: -1 });

    res.json(list.map((a) => ({
      _id: a._id,
      pname: a.patient?.name || "",
      pemail: a.patient?.email || "",
      pphone: a.patient?.phone || "",
      dname: a.doctor?.name || "",
      date: a.date, time: a.time, type: a.type,
      fee: a.consultationFee, ref: a.transactionRef,
      hasProof: !!a.paymentProof,
      submittedAt: a.updatedAt,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/:id/proof   (admin views receipt)
const getProofImage = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt || !appt.paymentProof) {
      return res.status(404).json({ message: "No receipt on file" });
    }

    const isOwner  = appt.patient.toString() === req.user._id.toString();
    const isDoctor = appt.doctor.toString() === req.user._id.toString();
    if (!isOwner && !isDoctor && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const filePath = path.join(__dirname, "..", "uploads", "payments",
                               path.basename(appt.paymentProof));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Receipt file missing" });
    }
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/payments/:id/verify   (admin approves / rejects)
const verifyPayment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    const approve = req.body.approve === true;
const isDoctor = appt.doctor.toString() === req.user._id.toString();
    if (!isDoctor && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    appt.paymentStatus = approve ? "paid" : "rejected";
    appt.paymentNote   = approve ? "" : (req.body.reason || "Payment could not be verified");
    appt.paidAt        = approve ? new Date() : undefined;
    appt.verifiedBy    = approve ? req.user._id : undefined;
    await appt.save();

    res.json({
      message: approve ? "Payment verified" : "Payment rejected",
      paymentStatus: appt.paymentStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPaymentDetails,
  submitProof,
  getPendingPayments,
  getProofImage,
  verifyPayment,
};