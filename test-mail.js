const nodemailer = require("nodemailer");
const port = Number(process.env.SMTP_PORT);
nodemailer.createTransport({
  host: process.env.SMTP_HOST, port, secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}).sendMail({
  from: process.env.SMTP_USER, to: process.env.NOTIFY_EMAIL,
  subject: "Test SAGFA", text: "Si tu lis ceci, Gmail fonctionne.",
}).then(() => console.log("ENVOYÉ")).catch((e) => console.log("ERREUR :", e.message));