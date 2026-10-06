const Appointment = require("../models/Appointment");
const User = require("../models/User");

// DB shape ko frontend shape mein convert karo
const format = (a) => ({
  _id:    a._id,
  id:     a._id,
  pid:    a.patient?._id || a.patient,
  pname:  a.patient?.name || "",
  pphone: a.patient?.phone || "",
  did:    a.doctor?._id || a.doctor,
  dname:  a.doctor?.name || "",
  dspec:  a.doctor?.spec || "",
  type:   a.type,
  plat:   a.platform || null,
  date:   a.date,
  time:   a.time,
  status: a.status,
  sev:    a.severity,
  atype:  a.acneType,
  link:   a.meetingLink || null,
  fee:    a.consultationFee,
  payment: a.paymentStatus,
  notes:  a.notes,
  createdAt: a.createdAt,
});

// GET /api/appointments/doctors  — booking ke liye doctors list
const getDoctors = async (req, res) => {
  try {
const doctors = await User.find({ role: "dermatologist", available: { $ne: false } ,isVerified: true, })    
.select("name email role avatar spec exp rating fee ofee qual days bio platforms startTime endTime");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/appointments  — appointment book karo
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, type, platform, date, time, severity, acneType } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "Doctor, date and time are required" });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "dermatologist") {
      return res.status(404).json({ message: "Doctor not found" });
    }
if (!doctor.isVerified) {
      return res.status(403).json({ message: "This dermatologist is not yet verified" });
    }
    // ---------- date validation ----------
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const apptDate = new Date(date + "T00:00:00");
    if (isNaN(apptDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (apptDate < today) {
      return res.status(400).json({ message: "Cannot book an appointment in the past" });
    }

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (apptDate > maxDate) {
      return res.status(400).json({ message: "Appointments can only be booked up to 3 months ahead" });
    }

    // ---------- doctor's available days ----------
    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = DAY_NAMES[apptDate.getDay()];
    const docDays = (doctor.days || []).filter(Boolean);

    if (docDays.length && !docDays.includes(dayName)) {
      return res.status(400).json({
        message: `${doctor.name} is not available on ${dayName}. Available: ${docDays.join(", ")}`,
      });
    }

    // ---------- time within working hours ----------
    const parseSlot = (t) => {
      const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((t || "").trim());
      if (!m) return null;
      let h = parseInt(m[1], 10);
      const ampm = m[3].toUpperCase();
      if (ampm === "PM" && h !== 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return h;
    };

    const slotHour = parseSlot(time);
    if (slotHour === null) {
      return res.status(400).json({ message: "Invalid time format" });
    }

    const startH = parseInt((doctor.startTime || "09:00").split(":")[0], 10);
    const endH   = parseInt((doctor.endTime   || "17:00").split(":")[0], 10);

    if (slotHour < startH || slotHour >= endH) {
      return res.status(400).json({
        message: `${doctor.name} works ${doctor.startTime || "09:00"} – ${doctor.endTime || "17:00"}`,
      });
    }

    // ---------- platform must be one the doctor offers ----------
   if (type !== "physical" && platform) {
        const NAME_MAP = { zoom: "Zoom", google_meet: "Google Meet", whatsapp: "WhatsApp" };
      const docPlatforms = (doctor.platforms || []).filter(Boolean);
      if (docPlatforms.length && !docPlatforms.includes(NAME_MAP[platform])) {
        return res.status(400).json({
          message: `${doctor.name} offers: ${docPlatforms.join(", ")}`,
        });
      }
    }
    // same doctor + same date + same time already booked?
    const clash = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });
    if (clash) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }

    const apptType = type === "physical" ? "physical" : "online";

    const appointment = await Appointment.create({
      patient:  req.user._id,
      doctor:   doctorId,
      type:     apptType,
      platform: apptType === "online" ? (platform || "") : "",
      date,
      time,
      severity: severity || "",
      acneType: acneType || "",
      consultationFee: apptType === "online" ? (doctor.ofee || 0) : (doctor.fee || 0),
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "name email spec")
      .populate("patient", "name email phone");

    res.status(201).json(format(populated));
  } catch (error) {
    console.error("Appointment Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments/my  — patient ki appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ patient: req.user._id })
      .populate("doctor", "name email spec fee ofee")
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });

    res.json(appointments.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments/doctor  — doctor ki appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ doctor: req.user._id })
      .populate("patient", "name email phone skinType age gender")
      .populate("doctor", "name spec")
      .sort({ createdAt: -1 });

    res.json(appointments.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/appointments/:id  — status / link / notes update
const updateAppointment = async (req, res) => {
  try {
    const { status, meetingLink, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ---- OWNERSHIP CHECK ----
    const me = req.user._id.toString();
    const isPatient = appointment.patient.toString() === me;
    const isDoctor  = appointment.doctor.toString() === me;
    const isAdmin   = req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized for this appointment" });
    }
 
    // patient sirf cancel kar sakta hai
    if (isPatient && !isAdmin && !isDoctor) {
      if (status && status !== "cancelled") {
        return res.status(403).json({ message: "Patients can only cancel appointments" });
      }
      if (meetingLink !== undefined || paymentStatus !== undefined) {
        return res.status(403).json({ message: "Not allowed to change this field" });
      }
    }
if ((status === "completed" || meetingLink) && appointment.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Please complete the payment to continue. This appointment is not yet paid.",
      });
    }
     if (meetingLink && !/^https:\/\//.test(meetingLink)) {
      return res.status(400).json({ message: "Meeting link must start with https://" });
    }
    if (meetingLink && appointment.status === "cancelled") {
      return res.status(400).json({ message: "Cannot add a meeting link to a cancelled appointment" });
    }
    if (status)                  appointment.status        = status;
    
    if (meetingLink !== undefined) appointment.meetingLink = meetingLink;
    if (notes !== undefined)     appointment.notes         = notes;

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "name email spec")
      .populate("patient", "name email phone");

    res.json(format(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments  — admin: saari appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find()
      .populate("patient", "name email phone")
      .populate("doctor", "name email spec")
      .sort({ createdAt: -1 });

    res.json(appointments.map(format));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getDoctors,
  bookAppointment, 
  getMyAppointments, 
  getDoctorAppointments,
  updateAppointment,
  getAllAppointments
};