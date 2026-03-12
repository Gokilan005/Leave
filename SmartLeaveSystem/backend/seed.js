const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smartleave")
    .then(async () => {
        console.log("Connected to MongoDB, checking for seed users...");

        const count = await User.countDocuments();
        if (count > 0) {
            console.log("Database already has users. Exiting seed script.");
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: 'Gokilan',
                email: 'student@smartleave.com',
                password: password,
                role: 'student',
                department: 'CSBS',
                phone: '+919876543210' // Replace with real Twilio registered number if testing
            },
            {
                name: 'Dr. Sharma (HOD)',
                email: 'hod@smartleave.com',
                password: password,
                role: 'hod',
                department: 'CSBS',
                phone: '+919876543211'
            },
            {
                name: 'Prof. Kumar (Advisor)',
                email: 'advisor@smartleave.com',
                password: password,
                role: 'advisor',
                department: 'CSBS',
                phone: '+919876543212'
            }
        ];

        await User.insertMany(users);
        console.log("Seed users added successfully:");
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
