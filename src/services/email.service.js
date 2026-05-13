require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;




// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking System" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;


const sendRegestrationEmail = async (userEmail, name)=>{
    const subject = 'Welcome to Backend System 🚀';

    const text = `Hello ${name},
        Thank you for registering at Backend System.
        Your account has been successfully created and you are now part of our developer community.
        We’re excited to have you onboard.

        Best Regards,
        Backend System Team
        `;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Welcome Email</title>
        </head>

        <body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f7fb; padding:40px 0;">
            <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" border="0"
                style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td align="center"
                    style="background: linear-gradient(135deg, #f12711, #f5af19); padding:35px 20px; color:white;">
                    
                    <h1 style="margin:0; font-size:32px;">
                        Backend Ledger
                    </h1>

                    <p style="margin-top:10px; font-size:16px; opacity:0.9;">
                        Welcome to the platform 🚀
                    </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:40px 35px; color:#333333;">

                    <h2 style="margin-top:0; font-size:24px; color:#111827;">
                        Hello ${name},
                    </h2>

                    <p style="font-size:16px; line-height:1.8; color:#4b5563;">
                        Thank you for registering at 
                        <strong>Backend Ledger</strong>.
                    </p>

                    <p style="font-size:16px; line-height:1.8; color:#4b5563;">
                        Your account has been successfully created and you are now a part of our growing developer community.
                    </p>

                    <p style="font-size:16px; line-height:1.8; color:#4b5563;">
                        We’re excited to have you onboard and can’t wait to see what you build with us.
                    </p>

                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:35px auto;">
                        <tr>
                        <td align="center" bgcolor="#4f46e5" style="border-radius:8px;">
                            <a href="https://yourwebsite.com"
                            style="display:inline-block; padding:14px 28px; font-size:16px; color:white; text-decoration:none; font-weight:bold;">
                            Explore Platform
                            </a>
                        </td>
                        </tr>
                    </table>

                    <p style="font-size:15px; color:#6b7280; line-height:1.7;">
                        If you did not create this account, please ignore this email.
                    </p>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center"
                    style="background:#f9fafb; padding:25px; border-top:1px solid #e5e7eb;">

                    <p style="margin:0; font-size:14px; color:#6b7280;">
                        © 2026 Backend Ledger. All rights reserved.
                    </p>

                    <p style="margin-top:8px; font-size:13px; color:#9ca3af;">
                        Built for Developers ❤️
                    </p>

                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>
        </html>
        `;

        await sendEmail(userEmail, subject, text, html);

}

module.exports = {
    sendRegestrationEmail
}