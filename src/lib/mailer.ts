import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export const getMailer = () => {
  if (!transporter) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) {
      throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD environment variable is not set");
    }
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
};

export const FROM_EMAIL = process.env.GMAIL_USER || "3thegear.pt@gmail.com";
export const NOTIFY_EMAIL = process.env.THEGEAR_NOTIFY_EMAIL || "3thegear.pt@gmail.com";
