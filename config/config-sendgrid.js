import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const msg = (email, verificationToken) => {
  return {
    to: email,
    from: "adiczq@gmail.com",
    subject: "Email verification",
    text: "For verification your email please click link below :",
    html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}">Verify your email </a>`,
  };
};
