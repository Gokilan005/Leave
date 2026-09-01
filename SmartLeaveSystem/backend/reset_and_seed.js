const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const LeaveRequest = require('./models/LeaveRequest');
require('dotenv').config();

const departments = [
    'CSBS', 'CSE', 'IT', 'AIDS', 'AIML', 
    'ECE', 'EEE', 'VLSI', 'BIO-TECH', 
    'MECH', 'BIO-MEDICAL', 'CIVIL', 'CYBER SECURITY'
];

const defaultPassword = 'password123';

async function resetDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/smartleave";
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected successfully!");

        // 1. Clear all old collections
        console.log("Removing all old users and leave requests...");
        const deletedUsers = await User.deleteMany({});
        const deletedLeaves = await LeaveRequest.deleteMany({});
        console.log(`Deleted ${deletedUsers.deletedCount} users and ${deletedLeaves.deletedCount} leave requests.`);

        // 2. Hash default password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const newUsers = [];

        // 3. System Admin Account
        newUsers.push({
            name: 'Super Admin',
            email: 'admin@smartleave.com',
            password: hashedPassword,
            role: 'admin',
            department: 'CSBS',
            phone: '+919999999990'
        });

        // 4. Default CSBS Short Aliases
        newUsers.push({
            name: 'Dr. Sharma (CSBS HOD)',
            email: 'gokilanthangavel@gmail.com',
            password: hashedPassword,
            role: 'hod',
            department: 'CSBS',
            phone: '+919876543211'
        });

        newUsers.push({
            name: 'Prof. Kumar (CSBS Advisor)',
            email: 'advisor@smartleave.com',
            password: hashedPassword,
            role: 'advisor',
            department: 'CSBS',
            phone: '+919876543212'
        });

        // 5. Default Student
        newUsers.push({
            name: 'Gokilan (Student)',
            email: 'student@smartleave.com',
            password: hashedPassword,
            role: 'student',
            department: 'CSBS',
            phone: '+919876543210'
        });

        // 6. Department-Specific HODs, Advisors & Sample Students (for other departments)
        departments.forEach((dept, index) => {
            if (dept === 'CSBS') return; // CSBS accounts created in steps 4 & 5

            const code = dept.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            // HOD
            newUsers.push({
                name: `HOD ${dept}`,
                email: `hod.${code}@smartleave.com`,
                password: hashedPassword,
                role: 'hod',
                department: dept,
                phone: `+9190000000${(index + 1).toString().padStart(2, '0')}`
            });

            // Advisor
            newUsers.push({
                name: `Advisor ${dept}`,
                email: `advisor.${code}@smartleave.com`,
                password: hashedPassword,
                role: 'advisor',
                department: dept,
                phone: `+9191000000${(index + 1).toString().padStart(2, '0')}`
            });

            // Sample Student for Dept
            newUsers.push({
                name: `Student ${dept}`,
                email: `student.${code}@smartleave.com`,
                password: hashedPassword,
                role: 'student',
                department: dept,
                phone: `+9192000000${(index + 1).toString().padStart(2, '0')}`
            });
        });

        // 7. Insert all users
        const createdUsers = await User.insertMany(newUsers);
        console.log(`\nSuccessfully created ${createdUsers.length} fresh users!`);

        console.log("\n=================== CREDENTIALS LIST ===================");
        console.log(`Global Password for all accounts: ${defaultPassword}\n`);
        console.log("--- SYSTEM ADMIN ---");
        console.log("Email: admin@smartleave.com | Role: admin");

        console.log("\n--- IT DEPARTMENT ---");
        console.log("HOD:     hod.it@smartleave.com");
        console.log("Advisor: advisor.it@smartleave.com");
        console.log("Student: student.it@smartleave.com");

        console.log("\n--- CSBS DEPARTMENT ---");
        console.log("HOD:     gokilanthangavel@gmail.com (or hod.csbs@smartleave.com)");
        console.log("Advisor: advisor.csbs@smartleave.com (or advisor@smartleave.com)");
        console.log("Student: student.csbs@smartleave.com (or student@smartleave.com)");

        console.log("\n--- CSE DEPARTMENT ---");
        console.log("HOD:     hod.cse@smartleave.com");
        console.log("Advisor: advisor.cse@smartleave.com");
        console.log("Student: student.cse@smartleave.com");
        console.log("========================================================\n");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Reset Database Error:", error);
        process.exit(1);
    }
}

resetDatabase();
