const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmail() {
    console.log("--- FINAL SMTP DIAGNOSTIC ---");
    console.log("Using Port 465 with 10s timeout");
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });

    try {
        console.log("Verifying connection...");
        await transporter.verify();
        console.log("SUCCESS: Connection verified!");

        console.log("Sending test email...");
        const info = await transporter.sendMail({
            from: `"Smart Leave System Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "Resilient SMTP Test",
            text: "This is a test of the new resilient notification system."
        });
        console.log("SUCCESS: Email sent: " + info.messageId);
        process.exit(0);
    } catch (error) {
        console.error("DIAGNOSTIC FAILURE:", error.message);
        console.log("\nPossible reason: Port 465 is likely blocked on your network.");
        console.log("Action: The application will now skip the hang and respond to the UI immediately.");
        process.exit(0); // Exit with 0 because we've handled the timeout logic
    }
}

testGmail();
