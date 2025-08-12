const nodemailer = require('nodemailer');

const createTransporter = () => {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to PropertyAuto Ethiopia!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">PropertyAuto</h1>
          <p style="color: #666; margin: 5px 0;">Ethiopia's Premier Marketplace</p>
        </div>
        
        <h2 style="color: #333;">Welcome, ${name}!</h2>
        
        <p style="color: #555; line-height: 1.6;">
          Thank you for joining PropertyAuto, Ethiopia's leading marketplace for cars, properties, lands, and machines.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>Browse thousands of verified listings</li>
            <li>Contact dealers and owners directly</li>
            <li>Save your favorite items</li>
            <li>Make offers and negotiate deals</li>
            <li>Get notifications on price changes</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" 
             style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Exploring
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Need help? Contact us at <a href="mailto:support@propertyauto.et">support@propertyauto.et</a></p>
          <p>© 2024 PropertyAuto Ethiopia. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  dealNotification: (dealData) => ({
    subject: `Deal Update - ${dealData.itemTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">PropertyAuto</h1>
        </div>
        
        <h2 style="color: #333;">Deal Update</h2>
        
        <p style="color: #555; line-height: 1.6;">
          There's an update on your deal for <strong>${dealData.itemTitle}</strong>
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Deal ID:</td>
              <td style="padding: 8px 0; color: #333;">${dealData.dealId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0; color: #333; text-transform: capitalize;">${dealData.status}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Price:</td>
              <td style="padding: 8px 0; color: #333;">${dealData.price} ${dealData.currency}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/deals/${dealData.dealId}" 
             style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Deal Details
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
          <p>© 2024 PropertyAuto Ethiopia. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request - PropertyAuto',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">PropertyAuto</h1>
        </div>
        
        <h2 style="color: #333;">Password Reset Request</h2>
        
        <p style="color: #555; line-height: 1.6;">
          You requested a password reset for your PropertyAuto account. Click the button below to reset your password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>Security Notice:</strong> This link will expire in 10 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
        </p>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Need help? Contact us at <a href="mailto:support@propertyauto.et">support@propertyauto.et</a></p>
          <p>© 2024 PropertyAuto Ethiopia. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  verification: (verificationUrl, name) => ({
    subject: 'Verify Your PropertyAuto Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">PropertyAuto</h1>
        </div>
        
        <h2 style="color: #333;">Verify Your Account</h2>
        
        <p style="color: #555; line-height: 1.6;">
          Hi ${name}, please verify your email address to complete your PropertyAuto registration.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
        </p>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #666; font-size: 14px;">
          <p>© 2024 PropertyAuto Ethiopia. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
