require('dotenv').config();
const notificationService = require('./services/notificationService');

const mockHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #10b981; padding: 35px 25px; text-align: center;">
        <div style="margin: 0 auto 15px; width: 64px; height: 64px; background-color: #ffffff; border-radius: 50%; display: table;">
            <div style="display: table-cell; vertical-align: middle; text-align: center; color: #10b981; font-size: 38px; font-weight: bold; font-family: Arial, sans-serif; padding-top: 4px;">
                ✔
            </div>
        </div>
        <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Leave Request Approved</h2>
    </div>
    <div style="padding: 30px; background-color: #ffffff;">
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">Hello Test Student,</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
            Your recent leave application has been reviewed and marked as <strong>Approved</strong> by your department faculty.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px; width: 35%;">Leave Date(s):</th>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">Oct 21, 2026 to Oct 23, 2026</td>
                </tr>
                <tr>
                    <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px;">Status:</th>
                    <td style="padding: 8px 0;">
                        <span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid #a7f3d0;">
                            Approved
                        </span>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: left; padding: 8px 0; color: #64748b; font-size: 14px;">Reviewed By:</th>
                    <td style="padding: 8px 0; color: #0f172a;">Prof. Smith User</td>
                </tr>
            </table>
        </div>
        
        <p style="color: #475569; font-size: 14px; margin-top: 30px; text-align: center;">Log in to the Smart Leave Portal to view your complete leave history.</p>
    </div>
    <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Smart Leave System. All rights reserved.</p>
    </div>
</div>
`;

async function testStyledEmail() {
    try {
        await notificationService.sendEmail(
            process.env.EMAIL_USER,
            "Leave Request Approved",
            "Your leave request has been approved.",
            mockHtml
        );
        console.log("Mock Styled Email Submitted Successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Failed", e);
        process.exit(1);
    }
}

testStyledEmail();
