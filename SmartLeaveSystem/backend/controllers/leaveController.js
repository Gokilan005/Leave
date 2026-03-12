const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

exports.applyLeave = async (req, res) => {
    const { date, endDate, reason } = req.body;

    const dateStr = (!endDate || date === endDate) ? date : `${date} to ${endDate}`;

    try {
        const leave = await LeaveRequest.create({
            student: req.user.id,
            date,
            endDate,
            reason
        });

        const populatedLeave = await LeaveRequest.findById(leave._id).populate('student', 'name department');

        // Notify HOD/Advisor in the same department
        const facultyMembers = await User.find({
            department: req.user.department,
            role: { $in: ['hod', 'advisor'] }
        });

        // Send notifications to faculty
        facultyMembers.forEach(faculty => {
            const appliedHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 24px;">New Leave Application</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.5;">Hello,</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">A new leave request has been submitted and requires your review.</p>
                    
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px; width: 35%;">Student Name:</th>
                                <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${req.user.name}</td>
                            </tr>
                            <tr>
                                <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px;">Department:</th>
                                <td style="padding: 8px 0; color: #0f172a;">${req.user.department}</td>
                            </tr>
                            <tr>
                                <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px;">Date:</th>
                                <td style="padding: 8px 0; color: #0f172a;">${dateStr}</td>
                            </tr>
                            <tr>
                                <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Reason:</th>
                                <td style="padding: 8px 0; color: #0f172a;">${reason}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #475569; font-size: 14px; margin-top: 30px; text-align: center;">Please log in to the Smart Leave Portal to approve or reject this request.</p>
                </div>
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Smart Leave System. All rights reserved.</p>
                </div>
            </div>`;

            // Email
            notificationService.sendEmail(
                faculty.email,
                'New Leave Request Notification',
                `Student: ${req.user.name}\nDepartment: ${req.user.department}\nDate: ${dateStr}\nReason: ${reason}`,
                appliedHtml
            );

            // SMS
            if (faculty.phone) {
                notificationService.sendSMS(
                    faculty.phone,
                    `Leave Alert: Student ${req.user.name} applied leave on ${dateStr}. Reason: ${reason}`
                );
            }
        });

        // Voice Call (example: to HOD only)
        const hod = facultyMembers.find(f => f.role === 'hod');
        if (hod && hod.phone) {
            notificationService.sendVoiceCall(
                hod.phone,
                `Hello sir. Student ${req.user.name} from ${req.user.department} has applied for leave today. Please check the leave management portal.`
            );
        }

        // Real-time update via Socket.io
        const io = req.app.get('io');
        io.emit('newLeaveRequest', populatedLeave);

        res.status(201).json(populatedLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLeaves = async (req, res) => {
    try {
        let leaves;
        // Students see only their own leaves
        if (req.user.role === 'student') {
            leaves = await LeaveRequest.find({ student: req.user.id })
                .populate('student', 'name department')
                .populate('approvedBy', 'name role');
        }
        // Faculty see leaves from their department
        else if (['hod', 'advisor'].includes(req.user.role)) {
            const studentsInDept = await User.find({ department: req.user.department }).select('_id');
            const studentIds = studentsInDept.map(s => s._id);
            leaves = await LeaveRequest.find({ student: { $in: studentIds } })
                .populate('student', 'name department')
                .populate('approvedBy', 'name role');
        }
        // Admin/Placement see all
        else {
            leaves = await LeaveRequest.find()
                .populate('student', 'name department')
                .populate('approvedBy', 'name role');
        }

        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        console.log("Updating status:", status, "for leave:", req.params.id);
        const leave = await LeaveRequest.findById(req.params.id).populate('student', 'name email phone');

        if (!leave) {
            console.log("Leave not found");
            return res.status(404).json({ message: 'Leave not found' });
        }

        if (!leave.student) {
            console.log("Student not found for leave");
            return res.status(404).json({ message: 'Student associated with this leave was not found' });
        }

        console.log("Proceeding with status update...");
        leave.status = status;
        leave.approvedBy = req.user.id;
        await leave.save();
        console.log("Leave saved successfully");

        const dateStr = (!leave.endDate || leave.date === leave.endDate) ? leave.date : `${leave.date} to ${leave.endDate}`;

        const isApproved = status === 'approved';
        const statusColor = isApproved ? '#10b981' : '#ef4444';
        const statusIcon = isApproved ? '✔' : '✖';
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        console.log("Generating email HTML...");
        const statusHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: ${statusColor}; padding: 35px 25px; text-align: center;">
                <div style="margin: 0 auto 15px; width: 64px; height: 64px; background-color: #ffffff; border-radius: 50%; display: table;">
                    <div style="display: table-cell; vertical-align: middle; text-align: center; color: ${statusColor}; font-size: 38px; font-weight: bold; font-family: Arial, sans-serif; padding-top: 4px;">
                        ${statusIcon}
                    </div>
                </div>
                <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Leave Request ${formattedStatus}</h2>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
                <p style="color: #475569; font-size: 16px; line-height: 1.5;">Hello ${leave.student.name},</p>
                <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                    Your recent leave application has been reviewed and marked as <strong>${formattedStatus}</strong> by your department faculty.
                </p>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px; width: 35%;">Leave Date(s):</th>
                            <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${dateStr}</td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px;">Status:</th>
                            <td style="padding: 8px 0;">
                                <span style="background-color: ${isApproved ? '#d1fae5' : '#fee2e2'}; color: ${isApproved ? '#065f46' : '#991b1b'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid ${isApproved ? '#a7f3d0' : '#fecaca'};">
                                    ${formattedStatus}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px;">Reviewed By:</th>
                            <td style="padding: 8px 0; color: #0f172a;">${req.user.name}</td>
                        </tr>
                    </table>
                </div>
                
                <p style="color: #475569; font-size: 14px; margin-top: 30px; text-align: center;">Log in to the Smart Leave Portal to view your complete leave history.</p>
            </div>
            <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Smart Leave System. All rights reserved.</p>
            </div>
        </div>`;

        console.log("Sending notifications...");
        // Notify Student
        if (leave.student && leave.student.email) {
            notificationService.sendEmail(
                leave.student.email,
                `Leave Request ${formattedStatus}`,
                `Your leave request for ${dateStr} has been ${status}.`,
                statusHtml
            );
        }

        if (leave.student && leave.student.phone) {
            notificationService.sendSMS(
                leave.student.phone,
                `Leave Alert: Your leave for ${dateStr} is ${status}.`
            );
        }

        console.log("Populating approvedBy...");
        await leave.populate('approvedBy', 'name role');

        // Real-time update
        console.log("Emitting socket event...");
        const io = req.app.get('io');
        if (io) {
            io.emit('leaveStatusUpdated', leave);
        }

        console.log("Sending final response");
        res.status(200).json(leave);
    } catch (error) {
        console.error("Error in updateLeaveStatus:", error);
        res.status(500).json({ message: error.message });
    }
};
