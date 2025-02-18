const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log("Loaded ENV:", process.env.EMAIL_USER, process.env.EMAIL_PASS);
console.log("Initializing server...");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

// ✅ Define the transporter here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/send-email', (req, res) => {
  console.log("Received email request:", req.body);

  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  // ✅ Send email using the defined transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send(`Failed to send email: ${error.message}`);
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
