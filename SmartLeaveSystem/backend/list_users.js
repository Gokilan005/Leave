const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function listUsers() {
    const uris = [
        process.env.MONGODB_LOCAL_URI || "mongodb://localhost:27017/smartleave",
        process.env.MONGODB_URI
    ];

    for (const uri of uris) {
        if (!uri) continue;
        console.log(`Trying to connect to: ${uri.split('@').pop()}`); // Don't log full Atlas URI
        try {
            const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log("Connected successfully!");
            const users = await User.find({}).select('email role name');
            console.log("USERS:", JSON.stringify(users, null, 2));
            await mongoose.disconnect();
            process.exit(0);
        } catch (e) {
            console.error(`Failed to connect to ${uri.split('@').pop()}: ${e.message}`);
        }
    }
    console.log("Could not connect to any DB.");
    process.exit(1);
}
listUsers();
