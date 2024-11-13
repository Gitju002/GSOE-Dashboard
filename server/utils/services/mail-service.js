import nodemailer from "nodemailer";

export const sendMail = async (mailOptions) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD,
      }
    });
    await transport.sendMail(mailOptions);
}
    