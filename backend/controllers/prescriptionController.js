const Prescription = require("../models/Prescription");
const Appointment  = require("../models/Appointment");
const User         = require("../models/User");
const Message      = require("../models/Message");
const { createNotifications } = require("../services/notifications");

// DB shape ko frontend shape mein badlo
const format = (p) => ({
  _id:      p._id,
  id:       p._id,
  apid:     p.appointment?._id || p.appointment || null,
  pid:      p.patient?._id || p.patient,
  pname:    p.patient?.name || "",
  pemail:   p.patient?.email || "",
  did:      p.doctor?._id || p.doctor,
  dname:    p.doctor?.name || "",
  dqual:    p.doctor?.qual || "",
  dspec:    p.doctor?.spec || "",
  meds:     p.meds || [],
  skincare: p.skincare || [],
  inst:     p.instructions,
  diet:     p.dietAdvice,
  fu:       p.followUp,
  date:     p.createdAt?.toISOString().slice(0, 10),
  createdAt: p.createdAt,
});

const populated = (id) =>
  Prescription.findById(id)
    .populate("patient", "name email skinType")
    .populate("doctor", "name email spec qual");

// POST /api/prescriptions   (doctor only)
const createPrescription = async (req, res) => {
  try {
    if (!req.user.isVerified) {
      return res.status(403).json({
        message: "Your account is pending verification. You cannot issue prescriptions yet.",
      });
    }

    const { patientId, appointmentId, meds, skincare, instructions, dietAdvice, followUp } = req.body;
    if (!patientId) {
      return res.status(400).json({ message: "Patient is required" });
    }
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    // agar appointment di hai to woh isi doctor ki honi chahiye
    if (appointmentId) {
      const appt = await Appointment.findById(appointmentId);
      if (!appt) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      if (appt.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "This appointment is not yours" });
      }
      if (appt.patient.toString() !== patientId.toString()) {
        return res.status(400).json({ message: "The selected appointment belongs to another patient" });
      }
    }

    const rx = await Prescription.create({
      appointment: appointmentId || null,
      patient:     patientId,
      doctor:      req.user._id,
      meds:        Array.isArray(meds) ? meds : [],
      skincare:    Array.isArray(skincare) ? skincare : [],
      instructions: instructions || "",
      dietAdvice:   dietAdvice || "",
      followUp:     followUp || "",
    });

    // appointment ko completed mark kar do
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: "completed", $unset: { completionUndoUntil: 1 } });
    }

    if (instructions?.trim()) {
      const doctorName = req.user.name?.startsWith("Dr.") ? req.user.name : `Dr. ${req.user.name || "your dermatologist"}`;
      await createNotifications({
        recipients: [{ id: patientId, targetPage: "prescriptions" }],
        actor: req.user._id,
        appointment: appointmentId || undefined,
      prescription: rx._id,
        type: "doctor_instructions",
        title: `New instructions from ${doctorName}`,
        message: "Your dermatologist sent you new skincare instructions.",
      });
    }

    res.status(201).json(format(await populated(rx._id)));
  } catch (error) {
    console.error("Prescription Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/prescriptions/my   (patient)
const getMyPrescriptions = async (req, res) => {
  try {
    const list = await Prescription.find({ patient: req.user._id })
      .populate("patient", "name email skinType")
      .populate("doctor", "name email spec qual")
      .sort({ createdAt: -1 });
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          prescription: { $in: list.map((prescription) => prescription._id) },
          recipient: req.user._id,
          channel: { $ne: "instruction" },
          read: { $ne: true },
        },
      },
      { $group: { _id: "$prescription", count: { $sum: 1 } } },
    ]);
    const unreadByPrescription = new Map(unreadCounts.map(({ _id, count }) => [String(_id), count]));
    res.json(list.map((prescription) => ({
      ...format(prescription),
      unreadChatCount: unreadByPrescription.get(String(prescription._id)) || 0,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/prescriptions/doctor   (doctor)
const getDoctorPrescriptions = async (req, res) => {
  try {
    const list = await Prescription.find({ doctor: req.user._id })
      .populate("patient", "name email skinType")
      .populate("doctor", "name email spec qual")
      .sort({ createdAt: -1 });
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          prescription: { $in: list.map((prescription) => prescription._id) },
          recipient: req.user._id,
          channel: { $ne: "instruction" },
          read: { $ne: true },
        },
      },
      { $group: { _id: "$prescription", count: { $sum: 1 } } },
    ]);
    const unreadByPrescription = new Map(unreadCounts.map(({ _id, count }) => [String(_id), count]));
    res.json(list.map((prescription) => ({
      ...format(prescription),
      unreadChatCount: unreadByPrescription.get(String(prescription._id)) || 0,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/prescriptions/patient/:patientId   (doctor / admin)
const getPatientPrescriptions = async (req, res) => {
  try {
    const list = await Prescription.find({ patient: req.params.patientId })
      .populate("patient", "name email skinType")
      .populate("doctor", "name email spec qual")
      .sort({ createdAt: -1 });
    res.json(list.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/prescriptions   (admin)
const getAllPrescriptions = async (req, res) => {
  try {
    const list = await Prescription.find()
      .populate("patient", "name email")
      .populate("doctor", "name email spec")
      .sort({ createdAt: -1 });
    res.json(list.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/prescriptions/:id
const getPrescriptionById = async (req, res) => {
  try {
    const rx = await populated(req.params.id);
    if (!rx) return res.status(404).json({ message: "Prescription not found" });

    const me = req.user._id.toString();
    const isPatient = rx.patient._id.toString() === me;
    const isDoctor  = rx.doctor._id.toString() === me;
    const isAdmin   = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this prescription" });
    }

    res.json(format(rx));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/prescriptions/:id   (issuing doctor only)
const updatePrescription = async (req, res) => {
  try {
    const rx = await Prescription.findById(req.params.id);
    if (!rx) return res.status(404).json({ message: "Prescription not found" });

    if (rx.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the issuing doctor can edit this" });
    }

    const { meds, skincare, instructions, dietAdvice, followUp } = req.body;
    const previousInstructions = rx.instructions;
    if (meds)                     rx.meds = meds;
    if (skincare)                 rx.skincare = skincare;
    if (instructions !== undefined) rx.instructions = instructions;
    if (dietAdvice !== undefined)   rx.dietAdvice = dietAdvice;
    if (followUp !== undefined)     rx.followUp = followUp;

    await rx.save();
    if (typeof instructions === "string" && instructions.trim() && instructions !== previousInstructions) {
      const doctorName = req.user.name?.startsWith("Dr.") ? req.user.name : `Dr. ${req.user.name || "your dermatologist"}`;
      await createNotifications({
        recipients: [{ id: rx.patient, targetPage: "prescriptions" }],
        actor: req.user._id,
        appointment: rx.appointment || undefined,
      prescription: rx._id,
        type: "doctor_instructions",
        title: `${doctorName} updated your instructions`,
        message: "Your skincare instructions have been updated. Open your skincare plans to review them.",
      });
    }
    res.json(format(await populated(rx._id)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPrescription,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
};
