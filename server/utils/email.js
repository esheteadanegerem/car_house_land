const nodemailer = require('nodemailer');

const createTransporter = () => {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: "tommr2323@gmail.com",
      pass: "ihes tjso xeff afdz"
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
      from: "noreply@propertyauto.et",
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

const wrapEmail = (title, content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdf9f4; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0;">WisdomWalk</h1>
      <p style="color: #666; margin: 5px 0;">Community of Wisdom</p>
    </div>
    <h2 style="color: #A67B5B; font-size: 26px; text-align: center;">${title}</h2>
    <div style="font-size: 16px; color: #555; line-height: 1.6;">
      ${content}
    </div>
    <hr style="border: none; border-top: 1px solid #e8ddd3; margin: 30px 0;" />
    <div style="font-size: 14px; color: #666; text-align: center;">
      <p>"She is clothed with strength and dignity, and she laughs without fear of the future."<br><strong>– Proverbs 31:25</strong></p>
      <p>Blessings,<br><strong>The WisdomWalk Team</strong></p>
      <p>Need help? Contact us at <a href="mailto:support@wisdomwalk.com">support@wisdomwalk.com</a></p>
      <p>© ${new Date().getFullYear()} WisdomWalk. All rights reserved.</p>
    </div>
  </div>
`;

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
          <p>© ${new Date().getFullYear()} PropertyAuto Ethiopia. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  verificationCode: (name, code) => ({
    subject: '🌸 Verify Your Email - WisdomWalk',
    html: wrapEmail('Email Verification', `
      <p>Hi ${name},</p>
      <p>Please verify your email by using the following code:</p>
      <div style="font-size: 32px; font-weight: bold; color: #A67B5B; letter-spacing: 8px; text-align: center; margin: 30px 0;">
        ${code}
      </div>
      <p style="color: #666; font-size: 14px;">This code will expire in 24 hours.</p>
    `),
    text: `Your WisdomWalk verification code is: ${code}\nThis code expires in 24 hours.`
  }),

  passwordReset: (name, code) => ({
    subject: '🔐 Reset Your Password - WisdomWalk',
    html: wrapEmail('Password Reset', `
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Use the code below:</p>
      <div style="font-size: 24px; font-weight: bold; color: #A67B5B; text-align: center; margin: 30px 0;">
        ${code}
      </div>
      <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
    `),
    text: `Your WisdomWalk password reset code is: ${code}\nThis code expires in 15 minutes.`
  }),

  adminNotification: (message, user) => ({
    subject: 'Admin Notification - WisdomWalk',
    html: wrapEmail('Admin Notification', `
      <p>${message}</p>
      <h4 style="color: #333;">User Details:</h4>
      <ul style="color: #555; line-height: 1.8;">
        <li><strong>Name:</strong> ${user.firstName} ${user.lastName}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Date of Birth:</strong> ${user.dateOfBirth}</li>
        <li><strong>Phone:</strong> ${user.phoneNumber}</li>
        <li><strong>Location:</strong> ${user.location}</li>
      </ul>
    `)
  }),

 
  
 
 
  dealCreated: (firstName, dealId, itemTitle) => ({
    subject: '🎉 New Deal Created - WisdomWalk',
    html: wrapEmail('Deal Created', `
      <p>Hi ${firstName},</p>
      <p>Congratulations! You've created a new deal for <strong>${itemTitle}</strong>.</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Deal Details:</h3>
        <ul style="color: #555; line-height: 1.8;">
          <li><strong>Deal ID:</strong> ${dealId}</li>
          <li><strong>Item:</strong> ${itemTitle}</li>
        </ul>
      </div>
      <p style="color: #555; line-height: 1.6;">The seller has been notified and will review your offer soon. You'll receive an update once the deal is accepted or responded to.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL}/deals/${dealId}" 
           style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Deal
        </a>
      </div>
    `),
    text: `Hi ${firstName},\nYou've created a new deal for ${itemTitle}.\nDeal ID: ${dealId}\nThe seller has been notified. View your deal at ${process.env.CLIENT_URL}/deals/${dealId}.`
  }),

  dealAccepted: (firstName, itemTitle, price, sellerContact) => ({
    subject: '✅ Deal Accepted - WisdomWalk',
    html: wrapEmail('Deal Accepted', `
      <p>Hi ${firstName},</p>
      <p>Great news! Your deal for <strong>${itemTitle}</strong> has been accepted!</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Deal Details:</h3>
        <ul style="color: #555; line-height: 1.8;">
          <li><strong>Item:</strong> ${itemTitle}</li>
          <li><strong>Agreed Price:</strong> ${price}</li>
          <li><strong>Seller Contact:</strong> ${sellerContact}</li>
        </ul>
      </div>
      <p style="color: #555; line-height: 1.6;">Please contact the seller to finalize payment and delivery details.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL}/deals" 
           style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Your Deals
        </a>
      </div>
      <div style="margin: 20px 0; padding: 15px; background: #fef2f2; border-radius: 6px; border-left: 4px solid #dc2626;">
        <p style="color: #dc2626; margin: 0; font-size: 14px;">
          <strong>Important:</strong> Ensure all transactions are secure and verified. Contact support if you encounter any issues.
        </p>
      </div>
    `),
    text: `Hi ${firstName},\nYour deal for ${itemTitle} has been accepted!\nAgreed Price: ${price}\nSeller Contact: ${sellerContact}\nView your deals at ${process.env.CLIENT_URL}/deals.`
  })
};

module.exports = {
  sendEmail,
  emailTemplates,
  createTransporter
};