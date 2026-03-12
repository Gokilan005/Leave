const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['student', 'hod', 'advisor', 'placement', 'admin'],
        default: 'student'
    },
    department: { type: String, required: true },
    rollNo: { type: String },
    section: { type: String },
    year: { type: String },
    phone: { type: String },
    profileImage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
