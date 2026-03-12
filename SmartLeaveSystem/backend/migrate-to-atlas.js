const mongoose = require('mongoose');
const User = require('./models/User');
const LeaveRequest = require('./models/LeaveRequest');
require('dotenv').config();

const LOCAL_DB = "mongodb://localhost:27017/smartleave";
const ATLAS_DB = process.env.MONGODB_ATLAS_URI;

async function migrateToAtlas() {
    try {
        console.log("Starting migration from local MongoDB to Atlas...");
        
        // Connect to local database
        console.log("Connecting to local MongoDB...");
        await mongoose.connect(LOCAL_DB);
        console.log("✓ Connected to local MongoDB");
        
        // Fetch all data from local database
        const users = await User.find();
        const leaveRequests = await LeaveRequest.find();
        
        console.log(`✓ Found ${users.length} users and ${leaveRequests.length} leave requests locally`);
        
        // Disconnect from local database
        await mongoose.disconnect();
        console.log("✓ Disconnected from local MongoDB");
        
        // Connect to Atlas
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(ATLAS_DB);
        console.log("✓ Connected to MongoDB Atlas");
        
        // Clear existing collections (optional - comment out if you want to keep existing data)
        // await User.deleteMany({});
        // await LeaveRequest.deleteMany({});
        // console.log("✓ Cleared existing collections");
        
        // Insert users
        if (users.length > 0) {
            // Remove _id to let MongoDB generate new ones, or keep them
            const usersData = users.map(u => u.toObject());
            await User.insertMany(usersData);
            console.log(`✓ Migrated ${users.length} users to Atlas`);
        }
        
        // Insert leave requests
        if (leaveRequests.length > 0) {
            const leavesData = leaveRequests.map(l => l.toObject());
            await LeaveRequest.insertMany(leavesData);
            console.log(`✓ Migrated ${leaveRequests.length} leave requests to Atlas`);
        }
        
        console.log("\n✓ Migration completed successfully!");
        console.log("Your collections are now in MongoDB Atlas.");
        
        process.exit(0);
    } catch (error) {
        console.error("Migration error:", error.message);
        if (error.errorResponse) {
            console.error("MongoDB Error Response:", error.errorResponse);
        }
        process.exit(1);
    }
}

migrateToAtlas();
