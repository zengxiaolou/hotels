import nodemailer from 'nodemailer';

export async function sendMail(
  from: string,
  fromPassword: string,
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    auth: {
      user: from,
      pass: fromPassword,
    },
  });
  let mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    throw e;
  }
}
