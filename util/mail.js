const nodemailer = require('nodemailer');

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
});

const sendVerificationEmail = async (email, verificationLink) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `
        <p>Click the following link to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };
  
    return transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return 'Error:', error;
        }
        console.log('Email sent:', info.response);
      });
  };

  module.exports = sendVerificationEmail;
  