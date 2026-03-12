const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_smartleave', {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role, department, rollNo, phone, section, year } = req.body;

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
            role: 'student', // Force student role for registration
            department,
            rollNo,
            section,
            year,
            phone
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                rollNo: user.rollNo,
                section: user.section,
                year: user.year,
                profileImage: user.profileImage,
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
                rollNo: user.rollNo,
                section: user.section,
                year: user.year,
                profileImage: user.profileImage,
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
    const { name, phone, email, department, rollNo, section, year } = req.body;

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
        user.rollNo = rollNo || user.rollNo;
        user.section = section || user.section;
        user.year = year || user.year;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
            rollNo: updatedUser.rollNo,
            section: updatedUser.section,
            year: updatedUser.year,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const imagePath = `/uploads/profiles/${req.file.filename}`;
        
        const User = require('../models/User'); // Required since User might be imported at top
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profileImage = imagePath;
        const updatedUser = await user.save();
        
        // Also import jsonwebtoken at the top, generateToken is likely available above.
        const jwt = require('jsonwebtoken');
        const generateToken = (id) => {
            return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_smartleave', {
                expiresIn: '30d',
            });
        };

        res.json({
            message: 'Profile picture updated successfully',
            profileImage: updatedUser.profileImage,
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                rollNo: updatedUser.rollNo,
                section: updatedUser.section,
                year: updatedUser.year,
                phone: updatedUser.phone,
                profileImage: updatedUser.profileImage,
                token: generateToken(updatedUser._id) // Added token just in case
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
