const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: './.env' });
require("dotenv").config({ path: './config.env' });
const pdf = require('html-pdf');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

const connectDB = require("./connection");
const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);

async function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "ReserveIt PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ReserveIt OTP</title>
</head>
<body>
<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
  <div style="margin: 50px auto; width: 70%; padding: 20px 0">
    <div style="border-bottom: 1px solid #eee">
      <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">ReserveIt</a>
    </div>
    <p style="font-size: 1.1em">Hi,</p>
    <p>Thank you. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${OTP}</h2>
    <p style="font-size: 0.9em;">Regards,<br />ReserveIt</p>
    <hr style="border: none; border-top: 1px solid #eee" />
    <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
      <p>ReserveIt</p>
    </div>
  </div>
</div>
</body>
</html>`,
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.log(error);
        return reject(new Error('An error occurred'));
      }
      resolve('Email sent successfully');
    });
  });
}

app.post("/send_recovery_email", (req, res) => {
  sendEmail(req.body)
    .then(message => res.send(message))
    .catch(error => res.status(500).send(error.message));
});

async function sendTicketEmail(userEmail, ticket) {
  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ReserveIt Booking Confirmation</title>
</head>
<body>
  <div>
    <h1>Order Details</h1>
    <p>Restaurant: ${ticket.Restraunt}</p>
    <p>Branch Name: ${ticket.BranchName}</p>
    <p>Seat: ${ticket.Seat}</p>
    <p>Item: ${ticket.item}</p>
    <p>Time: ${ticket.time}</p>
    <p>Date: ${ticket.date}</p>
    <p>Contact: ${ticket.contact}</p>
  </div>
  <p>Regards,<br />ReserveIt</p>
</body>
</html>`;

    const pdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(htmlContent).toBuffer((err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      }
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: userEmail,
      subject: 'ReserveIt Booking',
      html: 'Please find your booking details attached.',
      attachments: [{ filename: 'booking.pdf', content: pdfBuffer }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    return { message: 'Ticket email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

app.post("/send_ticket_email", (req, res) => {
  const { userEmail, ticket } = req.body;
  sendTicketEmail(userEmail, ticket)
    .then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message));
});

const PORT = 3500;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.log("Something went wrong");
    process.exit(1);
  }
});
