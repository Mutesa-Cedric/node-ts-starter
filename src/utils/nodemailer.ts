import nodemailer =require("nodemailer");

interface IResponse {
  error?: string;
  sent?: boolean;
}

export const sendEmail = async (
  to: string,
  verificationCode: string
): Promise<IResponse> => {
  let sent: boolean = false;
  let error: string | undefined = undefined;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject: "Your smstippers Verification Code",
      html: `
        <div style="text-align: center; font-size: 20px; font-weight: bold;">
          Your Verification Code:
        </div>
        <div style="text-align: center; font-size: 30px; margin-top: 10px;">
          ${verificationCode}
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
    sent = true;
  } catch (err:any) {
    console.log(err);
    error = err;
  }

  return {
    error: error,
    sent: sent,
  };
};
