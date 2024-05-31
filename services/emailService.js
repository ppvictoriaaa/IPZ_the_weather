const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

function sendNewsletterEmail(email, message) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `Newsletter Subscription Confirmation`,
    text: message,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = {
  sendNewsletterEmail,
};
