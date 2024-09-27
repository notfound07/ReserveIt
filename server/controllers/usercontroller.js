const User = require("../model/userSchema");
const Feedback = require("../model/feedbackSchema");
const Submission = require("../model/datasubmission");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require("nodemailer");
const pdf = require('html-pdf');

// Function to send ticket email
const sendTicketEmail = async (userEmail, ticket) => {
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
};

const sendEmail = async ({ recipient_email, OTP }) => {
    if (!recipient_email) {
        return Promise.reject({ message: "No recipient_email email provided" });
    }
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD,
                authMethod: 'PLAIN'
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
};

const send_recovery_email = async (req, res) => {
    const { recipient_email, OTP } = req.body;

    if (!recipient_email) {
        return res.status(400).send("No recipient_email email provided");
    }

    sendEmail({ recipient_email, OTP })
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
};

// Function to login
const login = async (req, res) => {
    try {
        const { email, password } = req.query;

        // Validate if email and password are provided
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Find user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: "No user found for this email" });
        }

        // Compare passwords
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        // Generate token
        const token = jwt.sign({ email: user.email, id: user.id }, "test", { expiresIn: "1h" });

        // Send successful response with user and token
        return res.status(200).json({ result: user, token });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to reset password
const reset_password = async (req, res) => {
    const { email, password, confirmpassword } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!password || !confirmpassword) {
            return res.status(400).json({ message: "Both password and confirm password are required" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        if (!validator.matches(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            return res.status(400).json({ message: "Password must be exactly 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number" });
        }

        // Update user's password in the database
        await User.updateOne({ email }, { $set: { password: hashedPassword, confirmpassword: hashedPassword } });

        // Respond with success message
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to sign up for a new customer
const signup = async (req, res) => {
    try {
        const { name, email, username, password, confirmpassword } = req.body;

        // Validating the user data.
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        if (!confirmpassword) {
            return res.status(400).json({ message: "Confirm password is required" });
        }
        // Password validation
        if (!validator.matches(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            return res.status(400).json({ message: "Password must be exactly 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
            confirmpassword: hashedPassword
        });

        // Respond with success message
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to handle feedback submission
// Function to handle feedback submission
const feedback = async (req, res) => {
    try {
        const { name, email, message } = req.body; // Ensure this matches what you send from the client

        // Validating the feedback data.
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new feedback entry in the database
        const newFeedback = await Feedback.create({
            name,
            email,
            msg: message// Make sure this key matches the one in your frontend
        });

        // Respond with success message
        res.status(201).json(newFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Function to retrieve all feedback
const Allfeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to handle booking
const booking = async (req, res) => {
    try {
        const { OrderId, Restraunt, BranchName, UserEmail, Seat, id, item, time, date, contact } = req.body;

        // Validating the user data.
        if (!OrderId || !Restraunt || !BranchName || !UserEmail || !Seat || !id || !item || !time || !date || !contact) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newReservation = await Submission.create({
            OrderId,
            Restraunt,
            BranchName,
            UserEmail,
            Seat,
            id,
            item,
            time,
            date,
            contact,
        });

        if (newReservation) {
            // Create the ticket object
            const ticket = {
                Restraunt: newReservation.Restraunt,
                BranchName: newReservation.BranchName,
                Seat: newReservation.Seat,
                item: newReservation.item,
                time: newReservation.time,
                date: newReservation.date,
                contact: newReservation.contact
            };

            // Send email with ticket details
            await sendTicketEmail(UserEmail, ticket); 

            return res.status(201).json(newReservation);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to retrieve all records
const Allrecords = async (req, res) => {
    try {
        const records = await Submission.find();
        res.status(200).json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export all functions
module.exports = {
    login,
    signup,
    reset_password,
    feedback,
    Allfeedbacks,
    booking,
    Allrecords,
    send_recovery_email,
};
