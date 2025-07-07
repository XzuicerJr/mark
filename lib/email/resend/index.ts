import { Resend } from "resend";
import { ResendEmailOptions } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send email using Resend (Recommended for production)
export const sendResendEmail = async (opts: ResendEmailOptions) => {
  const {
    email,
    from,
    bcc,
    replyTo = "cesarzamoradiaz@gmail.com",
    subject,
    text,
    react,
  } = opts;

  return await resend.emails.send({
    to: email,
    from: from || "Mark <system@zamora.dev>",
    bcc: bcc,
    replyTo,
    subject,
    text,
    react,
  });
};
