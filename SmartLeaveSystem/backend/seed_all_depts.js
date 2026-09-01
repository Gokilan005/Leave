const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const departments = ['CSBS', 'CSE', 'IT', 'AIDS', 'AIML', 'ECE', 'EEE', 'VLSI', 'BIO-TECH', 'MECH', 'BIO-MEDICAL', 'CIVIL', 'CYBER SECURITY'];
const defaultPassword = 'password123';

console.log("MONGODB_URI from .env:", process.env.MONGODB_URI ? "Found" : "Missing");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smartleave")
    .then(async () => {
        console.log("Connected to MongoDB for all-department seeding...");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const newUsers = [];

        for (const dept of departments) {
            // HOD for Department
            const hodEmail = `hod.${dept.toLowerCase()}@smartleave.com`;
            const hodExists = await User.findOne({ email: hodEmail });
            if (!hodExists) {
                newUsers.push({
                    name: `HOD ${dept}`,
                    email: hodEmail,
                    password: hashedPassword,
                    role: 'hod',
                    department: dept,
                    phone: `+910000000${departments.indexOf(dept)}1`
                });
            }

            // Advisor for Department
            const advisorEmail = `advisor.${dept.toLowerCase()}@smartleave.com`;
            const advisorExists = await User.findOne({ email: advisorEmail });
            if (!advisorExists) {
                newUsers.push({
                    name: `Advisor ${dept}`,
                    email: advisorEmail,
                    password: hashedPassword,
                    role: 'advisor',
                    department: dept,
                    phone: `+910000000${departments.indexOf(dept)}2`
                });
            }
        }

        if (newUsers.length > 0) {
            await User.insertMany(newUsers);
            console.log(`${newUsers.length} new staff users added successfully.`);
        } else {
            console.log("All department staff already exist.");
        }

        console.log("\nDefault Staff Credentials (Password: password123):");
        const allStaff = await User.find({ role: { $in: ['hod', 'advisor'] } });
        allStaff.forEach(u => {
            console.log(`- ${u.role.toUpperCase()} [${u.department}]: ${u.email}`);
        });

        process.exit();
    })
    .catch(err => {
        console.error("Seeding Error:", err);
        process.exit(1);
    });
