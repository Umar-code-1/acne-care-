// services/mailer.js — emails (password reset waghera) bhejta hai
// Render ka free plan SMTP ports (25/465/587) block karta hai, is liye live server par
// Brevo ki HTTPS API use karo (BREVO_API_KEY). SMTP local/paid servers ke liye fallback hai.
const nodemailer = require("nodemailer");

const isMailConfigured = () => Boolean(
  (process.env.BREVO_API_KEY && process.env.MAIL_FROM) ||
  (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
);

const sendWithBrevo = async ({ to, subject, text, html }) => {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: process.env.MAIL_FROM_NAME || "AcneCare AI", email: process.env.MAIL_FROM },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo email failed (${res.status}): ${detail.slice(0, 300)}`);
  }
};

const sendWithSmtp = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

const sendMail = (message) => (
  process.env.BREVO_API_KEY && process.env.MAIL_FROM
    ? sendWithBrevo(message)
    : sendWithSmtp(message)
);

module.exports = { isMailConfigured, sendMail };
