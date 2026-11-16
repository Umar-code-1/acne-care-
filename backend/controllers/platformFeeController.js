// controllers/platformFeeController.js
// Patient doctor ko direct pay karta hai; doctor har mahine platform ko
// PLATFORM_FEE_PERCENT (default 12%) bhejta hai aur receipt upload karta hai.
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const PlatformFee = require("../models/PlatformFee");
const User = require("../models/User");
const { saveFile, deleteFile, sendStoredFile } = require("../services/fileStorage");
const { createNotifications, getAdminIds } = require("../services/notifications");

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

const feeRate = () => {
  const n = Number(process.env.PLATFORM_FEE_PERCENT);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : 12;
};

// Pakistan time (UTC+5) — month aur due date isi hisaab se
const pkToday = () => new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
const currentMonth = () => pkToday().slice(0, 7);

// fee next month ki 10 tareekh tak due
const dueDateFor = (month) => {
  const [y, m] = month.split("-").map(Number);
  return `${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}-10`;
};

const feeFor = (gross, rate) => Math.round((gross * rate) / 100);

// paid + not cancelled appointments, doctor aur month ke hisaab se
const earningsQuery = (match = {}) => Appointment.aggregate([
  { $match: { paymentStatus: "paid", status: { $ne: "cancelled" }, ...match } },
  { $group: {
      _id: { doctor: "$doctor", month: { $substrBytes: ["$date", 0, 7] } },
      appointmentCount: { $sum: 1 },
      grossAmount: { $sum: { $ifNull: ["$consultationFee", 0] } },
  } },
]);

// ek mahine ki summary row: live earnings + payment record
const buildRow = (month, earn, record, rate, today = pkToday()) => {
  const appointmentCount = earn?.appointmentCount || 0;
  const grossAmount = earn?.grossAmount || 0;
  const feeAmount = feeFor(grossAmount, rate);
  const paidAmount = record?.paidAmount || 0;
  const pendingAmount = record?.status === "pending_verification" ? record.amountSubmitted : 0;
  const balanceDue = Math.max(0, feeAmount - paidAmount - pendingAmount);
  const dueDate = dueDateFor(month);
  const isCurrent = month === currentMonth();

  let status;
  if (pendingAmount > 0) status = "pending_verification";
  else if (feeAmount === 0) status = "no_fee";
  else if (balanceDue === 0) status = "paid";
  else if (isCurrent) status = "running";
  else if (today > dueDate) status = "overdue";
  else status = "due";

  return {
    id: record?._id || null,
    month,
    appointmentCount,
    grossAmount,
    rate,
    feeAmount,
    paidAmount,
    pendingAmount,
    balanceDue,
    dueDate,
    status,
    canPay: !isCurrent && balanceDue > 0 && pendingAmount === 0,
    hasProof: Boolean(record?.proof),
    transactionRef: record?.transactionRef || "",
    submittedAt: record?.submittedAt || null,
    verifiedAt: record?.verifiedAt || null,
    rejectionNote: record?.status === "rejected" ? record.note : "",
  };
};

const isPlaceholder = (v) => !v || /^\s*(your\b|xxx)/i.test(v);
const companyDetails = () => {
  const e = process.env;
  const pick = (v) => (isPlaceholder(v) ? "" : String(v).trim());
  const d = {
    name: "AcneCare AI",
    bankName: pick(e.BANK_NAME),
    accountTitle: pick(e.BANK_TITLE),
    accountNumber: pick(e.BANK_ACCOUNT),
    iban: pick(e.BANK_IBAN),
    jazzcash: pick(e.JAZZCASH_NUM),
    easypaisa: pick(e.EASYPAISA_NUM),
  };
  d.configured = Boolean((d.bankName && d.accountTitle && d.accountNumber) || d.jazzcash || d.easypaisa);
  return d;
};

// GET /api/platform-fees/company-details
const getCompanyDetails = (req, res) => res.json(companyDetails());

// GET /api/platform-fees/my?month=YYYY-MM   (doctor)
const getMyFees = async (req, res) => {
  try {
    const rate = feeRate();
    const thisMonth = currentMonth();
    const month = MONTH_RE.test(req.query.month || "") ? req.query.month : thisMonth;

    const [earnings, records] = await Promise.all([
      earningsQuery({ doctor: req.user._id }),
      PlatformFee.find({ doctor: req.user._id }).lean(),
    ]);
    const earnByMonth = new Map(earnings.map((e) => [e._id.month, e]));
    const recByMonth = new Map(records.map((r) => [r.month, r]));
    const months = new Set([thisMonth, ...earnByMonth.keys(), ...recByMonth.keys()]);

    const history = [...months]
      .filter((m) => MONTH_RE.test(m))
      .sort((a, b) => b.localeCompare(a))
      .map((m) => buildRow(m, earnByMonth.get(m), recByMonth.get(m), rate));

    const appts = await Appointment.find({
      doctor: req.user._id,
      paymentStatus: "paid",
      status: { $ne: "cancelled" },
      date: { $regex: `^${month}-` },
    }).populate("patient", "name").sort({ date: 1 }).lean();

    const past = history.filter((r) => r.month !== thisMonth);
    res.json({
      rate,
      currentMonth: thisMonth,
      selectedMonth: month,
      current: history.find((r) => r.month === thisMonth),
      selected: history.find((r) => r.month === month) || buildRow(month, null, null, rate),
      totalDue: past.reduce((s, r) => s + r.balanceDue, 0),
      overdueCount: past.filter((r) => r.status === "overdue").length,
      history,
      appointments: appts.map((a) => ({
        _id: a._id,
        date: a.date,
        time: a.time,
        type: a.type,
        status: a.status,
        patientName: a.patient?.name || "Patient",
        fee: a.consultationFee || 0,
        platformFee: feeFor(a.consultationFee || 0, rate),
      })),
      company: companyDetails(),
    });
  } catch (error) {
    console.error("Platform fee (doctor) error:", error.message);
    res.status(500).json({ message: "Could not load your platform fee." });
  }
};

// POST /api/platform-fees/:month/proof   (doctor, multipart: proof + transactionRef)
const submitFeeProof = async (req, res) => {
  try {
    const { month } = req.params;
    if (!MONTH_RE.test(month)) return res.status(400).json({ message: "Invalid month." });
    if (!req.file) return res.status(400).json({ message: "Please upload your payment receipt." });
    if (month >= currentMonth()) {
      return res.status(400).json({ message: "You can pay this month's fee after the month ends." });
    }

    const rate = feeRate();
    const [earn] = await earningsQuery({ doctor: req.user._id, date: { $regex: `^${month}-` } });
    let record = await PlatformFee.findOne({ doctor: req.user._id, month });
    const row = buildRow(month, earn, record, rate);

    if (row.pendingAmount > 0) {
      return res.status(409).json({ message: "A receipt for this month is already waiting for verification." });
    }
    if (row.balanceDue <= 0) {
      return res.status(400).json({ message: "Nothing is due for this month." });
    }

    const newProof = await saveFile(req.file, { kind: "fees", name: `fee-${req.user._id}-${month}` });
    const oldProof = record?.proof;
    const oldWasRejected = record?.status === "rejected";

    if (!record) record = new PlatformFee({ doctor: req.user._id, month });
    Object.assign(record, {
      appointmentCount: row.appointmentCount,
      grossAmount: row.grossAmount,
      rate,
      feeAmount: row.feeAmount,
      amountSubmitted: row.balanceDue,
      status: "pending_verification",
      proof: newProof,
      transactionRef: String(req.body.transactionRef || "").trim().slice(0, 80),
      submittedAt: new Date(),
      note: "",
    });
    await record.save();
    // rejected receipt ki file ab kaam ki nahi
    if (oldProof && oldWasRejected) await deleteFile(oldProof);

    const admins = await getAdminIds();
    await createNotifications({
      recipients: admins.map((id) => ({ id, targetPage: "platform-fees" })),
      actor: req.user._id,
      type: "platform_fee_submitted",
      title: "Platform fee receipt uploaded",
      message: `${req.user.name || "A doctor"} submitted PKR ${row.balanceDue.toLocaleString()} platform fee for ${month}.`,
    });

    res.json({
      message: "Receipt submitted. We'll verify it soon.",
      fee: buildRow(month, earn, record, rate),
    });
  } catch (error) {
    console.error("Platform fee submit error:", error.message);
    res.status(500).json({ message: "Could not submit your receipt. Please try again." });
  }
};

// GET /api/platform-fees/:id/proof   (owner doctor / admin)
const getFeeProof = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Receipt not found" });
    const record = await PlatformFee.findById(req.params.id);
    if (!record || !record.proof) return res.status(404).json({ message: "Receipt not found" });
    const isOwner = record.doctor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });
    await sendStoredFile(res, record.proof, "Receipt file missing");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/platform-fees?month=YYYY-MM   (admin)
const getAllFees = async (req, res) => {
  try {
    const rate = feeRate();
    const thisMonth = currentMonth();
    const month = MONTH_RE.test(req.query.month || "") ? req.query.month : thisMonth;

    const [earnings, records, pendingRecords] = await Promise.all([
      earningsQuery({ date: { $regex: `^${month}-` } }),
      PlatformFee.find({ month }).lean(),
      PlatformFee.find({ status: "pending_verification" }).populate("doctor", "name email").sort({ submittedAt: 1 }).lean(),
    ]);

    const byDoctor = new Map();
    for (const e of earnings) byDoctor.set(String(e._id.doctor), { earn: e });
    for (const r of records) {
      const k = String(r.doctor);
      byDoctor.set(k, { ...(byDoctor.get(k) || {}), record: r });
    }
    const doctors = await User.find({ _id: { $in: [...byDoctor.keys()] } }, "name email").lean();
    const docById = new Map(doctors.map((d) => [String(d._id), d]));

    const rows = [...byDoctor.entries()].map(([id, { earn, record }]) => ({
      doctorId: id,
      doctorName: docById.get(id)?.name || "Deleted doctor",
      doctorEmail: docById.get(id)?.email || "",
      ...buildRow(month, earn, record, rate),
    })).sort((a, b) => b.feeAmount - a.feeAmount);

    // pending receipts — kisi bhi mahine ke
    const pendingMonths = [...new Set(pendingRecords.map((r) => r.month))];
    const pendingEarn = pendingMonths.length
      ? await earningsQuery({
          doctor: { $in: pendingRecords.map((r) => r.doctor?._id).filter(Boolean) },
          $or: pendingMonths.map((m) => ({ date: { $regex: `^${m}-` } })),
        })
      : [];
    const pendKey = (d, m) => `${d}|${m}`;
    const pendEarnMap = new Map(pendingEarn.map((e) => [pendKey(e._id.doctor, e._id.month), e]));

    res.json({
      rate,
      month,
      currentMonth: thisMonth,
      totals: {
        doctors: rows.filter((r) => r.feeAmount > 0).length,
        grossAmount: rows.reduce((s, r) => s + r.grossAmount, 0),
        feeAmount: rows.reduce((s, r) => s + r.feeAmount, 0),
        collected: rows.reduce((s, r) => s + r.paidAmount, 0),
        pending: rows.reduce((s, r) => s + r.pendingAmount, 0),
        outstanding: rows.reduce((s, r) => s + r.balanceDue, 0),
      },
      rows,
      pending: pendingRecords.map((r) => ({
        doctorId: String(r.doctor?._id || ""),
        doctorName: r.doctor?.name || "Deleted doctor",
        doctorEmail: r.doctor?.email || "",
        ...buildRow(r.month, pendEarnMap.get(pendKey(r.doctor?._id, r.month)), r, rate),
      })),
    });
  } catch (error) {
    console.error("Platform fee (admin) error:", error.message);
    res.status(500).json({ message: "Could not load platform fees." });
  }
};

// PUT /api/platform-fees/:id/verify   (admin)  body: { approve, reason }
const verifyFee = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Record not found" });
    const record = await PlatformFee.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    if (record.status !== "pending_verification") {
      return res.status(409).json({ message: "This receipt has already been reviewed." });
    }

    const approve = req.body.approve === true;
    const amount = record.amountSubmitted;
    if (approve) {
      record.paidAmount += amount;
      record.status = "paid";
      record.note = "";
    } else {
      record.status = "rejected";
      record.note = String(req.body.reason || "").trim().slice(0, 300) || "Receipt could not be verified.";
    }
    record.amountSubmitted = 0;
    record.verifiedAt = new Date();
    record.verifiedBy = req.user._id;
    await record.save();

    await createNotifications({
      recipients: [{ id: record.doctor, targetPage: "platform-fee" }],
      actor: req.user._id,
      type: approve ? "platform_fee_verified" : "platform_fee_rejected",
      title: approve ? "Platform fee received" : "Platform fee receipt rejected",
      message: approve
        ? `Your platform fee of PKR ${amount.toLocaleString()} for ${record.month} has been verified. Thank you!`
        : `Your platform fee receipt for ${record.month} was rejected: ${record.note} Please upload it again.`,
    });

    res.json({ message: approve ? "Platform fee marked as paid." : "Receipt rejected.", status: record.status });
  } catch (error) {
    console.error("Platform fee verify error:", error.message);
    res.status(500).json({ message: "Could not update this receipt." });
  }
};

module.exports = {
  getCompanyDetails,
  getMyFees,
  submitFeeProof,
  getFeeProof,
  getAllFees,
  verifyFee,
  // tests ke liye
  _internal: { buildRow, feeFor, dueDateFor, currentMonth, earningsQuery },
};
