import nodemailer from "nodemailer";



const sendmail = async (email: string,id:string) => {
    // Setup transport (example using Gmail SMTP)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table align="center" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 30px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <!-- Logo -->
            <tr>
                <td style="padding: 20px;">
                    <img src="/api/placeholder/150/50" alt="Platform Logo" style="max-width: 150px;">
                </td>
            </tr>
    
            <!-- Main Content -->
            <tr>
                <td style="padding: 20px;">
                    <h2 style="color: #333; font-size: 22px; margin-bottom: 10px;">Reset Your Password</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.5;">
                        Hello, <br>
                        We received a request to reset your password. Click the button below to create a new password.
                    </p>
                    <a href="http://localhost:5173/changepasswored/${id}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block; margin: 20px 0;">Reset Password</a>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                </td>
            </tr>
    
            <!-- Fallback Reset Link -->
            <tr>
                <td style="padding: 20px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                    <p style="color: #888; font-size: 12px;">If the button above doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-wrap: break-word; font-size: 12px;">
                        <a href="http://tmpback.test/api/auth/passwored/reset/${id}" style="color: #007bff; text-decoration: none;">http://tmpback.test/api/auth/passwored/reset/{{$detailes['id']}}</a>
                    </p>
                </td>
            </tr>
    
            <!-- Footer -->
            <tr>
                <td style="padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    <p>Need help? <a href="mailto:support@yourplatform.com" style="color: #007bff; text-decoration: none;">Contact Support</a></p>
                    <p>&copy; 2025 Your Platform. All rights reserved.</p>
                </td>
            </tr>
        </table>
    
</div>
`,
    });
}
export default sendmail;
