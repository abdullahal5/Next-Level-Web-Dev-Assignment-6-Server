import nodemailer from "nodemailer";
import config from "../config";

export const SendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.NODE_ENV === "production",
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "Gardening HUB",
    to,
    subject: "Reset your password within 10 mins!",
    text: "",
    html,
  });
};
