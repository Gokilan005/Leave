const mongoose = require('mongoose');
require('dotenv').config();
const LeaveRequest = require('./models/LeaveRequest');
const User = require('./models/User');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const leave = await LeaveRequest.findById('69b1125bcc4f9a33f26a0156').populate('student');
        console.log("LEAVE DATA:", JSON.stringify(leave, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
