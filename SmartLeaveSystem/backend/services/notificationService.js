const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;
if (accountSid && authToken && accountSid !== "your_twilio_sid") {
    try {
        twilioClient = twilio(accountSid, authToken);
    } catch (err) {
        console.error("Twilio initialization error:", err);
    }
}

// Nodemailer Config
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

// Verify email service connectivity on initialization
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter.verify((error, success) => {
        if (error) {
            console.error("❌ [EMAIL ERROR] SMTP verification failed:", error.message);
        } else {
            console.log(`✅ [EMAIL READY] Connected to Gmail SMTP as: ${process.env.EMAIL_USER}`);
        }
    });
} else {
    console.warn("⚠️ [EMAIL WARNING] EMAIL_USER or EMAIL_PASS not set. Emails will be logged as MOCK.");
}

exports.sendEmail = async (to, subject, text, html = undefined) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
        return { mock: true };
    }

    try {
        const mailOptions = {
            from: `"Smart Leave System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };

        if (html) {
            mailOptions.html = html;
        }

        console.log(`📨 [SMTP] Sending email to: ${to} | Subject: "${subject}"...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [SMTP SUCCESS] Email delivered to ${to} (ID: ${info.messageId})`);
        return info;
    } catch (error) {
        console.error(`❌ [SMTP ERROR] Failed to send email to ${to}:`, error.message);
        return { error: error.message }; 
    }
};

exports.sendSMS = async (to, body) => {
    if (!twilioClient) {
        console.log(`[MOCK SMS] To: ${to} | Body: ${body}`);
        return;
    }

    try {
        const message = await twilioClient.messages.create({
            body: body,
            from: fromPhone,
            to: to,
        });
        console.log("SMS sent: %s", message.sid);
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
};

exports.sendVoiceCall = async (to, messageText) => {
    if (!twilioClient) {
        console.log(`[MOCK VOICE CALL] To: ${to} | Message: ${messageText}`);
        return;
    }

    try {
        // TwiML is the markup language used by Twilio to generate speech
        const twiml = `<Response><Say>${messageText}</Say></Response>`;

        const call = await twilioClient.calls.create({
            twiml: twiml,
            to: to,
            from: fromPhone,
        });
        console.log("Voice call initiated: %s", call.sid);
    } catch (error) {
        console.error("Error initiating voice call:", error);
    }
};
