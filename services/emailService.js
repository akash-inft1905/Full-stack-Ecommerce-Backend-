import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendOtpEmail = async (email, otp) => {
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            background-color: #f7f7f7;
            padding: 10px;
            display: inline-block;
            margin: 10px 0;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Verification</h1>
          <p>Hello,</p>
          <p>Your OTP for email verification is:</p>
          <p class="otp">${otp}</p>
          <p>This OTP is valid for 15 minutes.</p>
          <div class="footer">
            <p>If you did not request this email, please ignore it.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SENDER_MAIL,
    to: email,
    subject: "Verify your email",
    html, // Use the rendered HTML content
  };

  return transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email, resetUrl) => {
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Reset Request</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <div class="footer">
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SENDER_MAIL,
    to: email,
    subject: "Password Reset Request",
    html,
  };

  return transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (
  email,
  totalAmount,
  currency
) => {
  try {
    // Render the EJS template
    const templatePath = path.join(
      __dirname,
      "../emails/orderConfirmation.ejs"
    );
    const html = await ejs.renderFile(templatePath, { totalAmount, currency });

    // Email options
    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: email,
      subject: "Order Confirmation",
      html: html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully.");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};
