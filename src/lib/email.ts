import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: "Trainity <lokaming86@gmail.com>",
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    return true;
  } catch (error) {
    console.error("SMTP Error:", error);
    return false;
  }
};