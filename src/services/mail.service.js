const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true', // false para puerto 587
  requireTLS: true, // obliga STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    servername: process.env.MAIL_HOST,
    rejectUnauthorized: true,
  },
});

async function sendMail({ to, subject, text, html, attachments = [] }) {
  return await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

async function verifyMailConnection() {
  return await transporter.verify();
}

module.exports = {
  sendMail,
  verifyMailConnection,
};