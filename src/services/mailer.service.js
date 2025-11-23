const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.MAILER_DEFAULT_SENDER_EMAIL || "onboarding@resend.dev",
    to,
    subject: "Verifikasi Akun EduCourse",
    html: `
      <h3>Selamat datang di EduCourse!</h3>
      <p>Terima kasih sudah mendaftar. Klik tautan berikut untuk memverifikasi akun kamu:</p>
      <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
      <br/><br/>
      <p>Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
    `
  };

  try {
    const { data, error } = await resend.emails.send(mailOptions);

    if (error) {
      console.error("Gagal kirim email:", error);
      return false;
    }

    console.log("data resend :", data)
    console.log("Email terkirim. ID:", data.id);
    return true;

  } catch (err) {
    console.error("Resend error:", err);
    return false;
  }
};

module.exports = { sendVerificationEmail };
