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

exports.sendEmail = async (to, subject, text, html = undefined) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
        return;
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

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
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
