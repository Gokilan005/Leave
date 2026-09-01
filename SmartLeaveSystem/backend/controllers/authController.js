const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_smartleave', {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role, department, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            department,
            phone
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};

exports.updateProfile = async (req, res) => {
    const { name, phone, email, department } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.department = department || user.department;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
            phone: updatedUser.phone,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const notificationService = require('../services/notificationService');

exports.sendTestEmail = async (req, res) => {
    const targetEmail = req.body.email || req.query.email || process.env.EMAIL_USER;
    try {
        const result = await notificationService.sendEmail(
            targetEmail,
            'Smart Leave System - SMTP Verification Test',
            `Hello! This is a test email sent from the Smart Leave Notification System to verify that SMTP email delivery is operational.\n\nTime: ${new Date().toISOString()}`
        );

        if (result && result.error) {
            return res.status(500).json({ success: false, message: result.error });
        }

        res.json({
            success: true,
            message: `Test email successfully dispatched to ${targetEmail}`,
            messageId: result?.messageId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

