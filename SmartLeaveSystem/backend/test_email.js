require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log("Testing with User:", process.env.EMAIL_USER);
console.log("Password length:", process.env.EMAIL_PASS?.length);

async function testEmail() {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Smart Leave System - Email Test",
            text: "Hello! The Smart Leave System email configuration is working perfectly.",
        });
        console.log("SUCCESS! Test email sent:", info.messageId);
        process.exit(0);
    } catch (error) {
        console.error("FAILED to send test email:", error.message);
        process.exit(1);
    }
}

testEmail();
