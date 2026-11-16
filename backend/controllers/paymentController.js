const Appointment = require("../models/Appointment");
const { saveFile, deleteFile, sendStoredFile } = require("../services/fileStorage");
const { createNotifications, getAdminIds } = require("../services/notifications");


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
    if (!d) return res.status(404).json({ message: "The dermatologist account for this appointment is unavailable." });
    const hasBankTransfer = Boolean(d?.bankName && d?.accountTitle && d?.accountNumber);
    const hasWallet = Boolean(d?.jazzcash || d?.easypaisa);
    if (!hasBankTransfer && !hasWallet) {
      return res.status(400).json({
        message: "This dermatologist's payment details are incomplete. Please contact support before transferring any money.",
      });
    }

    res.json({
      doctorName:    d.name,
      hasBankTransfer,
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
    if (!["unpaid", "rejected"].includes(appt.paymentStatus)) {
      return res.status(409).json({
        message: "A receipt is already awaiting verification. Please wait for the payment review before submitting another.",
      });
    }

    // rejected receipt dobara bheja ho to purani file hata do
    const oldProof = appt.paymentProof;
    appt.paymentProof   = await saveFile(req.file, { kind: "payments", name: `proof-${appt._id}` });
    if (oldProof) await deleteFile(oldProof);
    appt.transactionRef = (req.body.transactionRef || "").trim();
    appt.paymentStatus  = "pending_verification";
    appt.paymentNote    = "";
    await appt.save();

    const admins = await getAdminIds();
    await createNotifications({
      recipients: [
        { id: appt.doctor, targetPage: "payments" },
        { id: req.user._id, targetPage: "appointments" },
        ...admins.map((id) => ({ id, targetPage: "appointments" })),
      ],
      actor: req.user._id,
      appointment: appt._id,
      type: "payment_proof",
      title: "Payment receipt uploaded",
      message: `${req.user.name || "A patient"} submitted a payment receipt for ${appt.date} at ${appt.time}.`,
    });

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

    await sendStoredFile(res, appt.paymentProof, "Receipt file missing");
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

    await createNotifications({
      recipients: [{ id: appt.patient, targetPage: "appointments" }],
      actor: req.user._id,
      appointment: appt._id,
      type: approve ? "payment_verified" : "payment_rejected",
      title: approve ? "Payment verified" : "Payment needs attention",
      message: approve
        ? `Your payment for the appointment on ${appt.date} has been verified.`
        : `Your payment for the appointment on ${appt.date} was not verified. ${appt.paymentNote}`,
    });

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
