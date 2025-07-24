import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { env } from './utils';

/**
 * 邮件配置接口
 */
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

/**
 * 邮件选项接口
 */
interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * 邮件模板数据接口
 */
interface EmailTemplateData {
  [key: string]: any;
}

/**
 * 邮件服务类
 */
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;
  private isInitialized = false;

  /**
   * 初始化邮件服务
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.config = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || '',
        },
        from: process.env.EMAIL_FROM || 'noreply@tiktokcalculator.com',
      };

      // 验证配置
      if (!this.config.auth.user || !this.config.auth.pass) {
        throw new Error('Email credentials not configured');
      }

      // 创建传输器
      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: this.config.auth,
        tls: {
          rejectUnauthorized: !env.isDevelopment,
        },
      });

      // 验证连接
      await this.transporter.verify();
      
      this.isInitialized = true;
      
      if (env.isDevelopment) {
        console.log('Email service initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      throw error;
    }
  }

  /**
   * 发送邮件
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.isInitialized || !this.transporter || !this.config) {
      throw new Error('Email service not initialized');
    }

    try {
      const mailOptions = {
        from: this.config.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      if (env.isDevelopment) {
        console.log('Email sent successfully:', result.messageId);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * 发送欢迎邮件
   */
  async sendWelcomeEmail(to: string, data: {
    name: string;
    verificationUrl?: string;
  }): Promise<void> {
    const subject = 'Welcome to TikTok Creator Calculator!';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to TikTok Creator Calculator!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            <p>Thank you for joining TikTok Creator Calculator! We're excited to help you estimate your potential earnings as a TikTok creator.</p>
            
            <p>With our advanced calculator, you can:</p>
            <ul>
              <li>Calculate potential monthly and yearly earnings</li>
              <li>Analyze different revenue streams</li>
              <li>Get personalized tips to increase your income</li>
              <li>Save and track your calculations</li>
            </ul>
            
            ${data.verificationUrl ? `
              <p>To get started, please verify your email address:</p>
              <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            ` : `
              <p>You can start using the calculator right away:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Start Calculating</a>
            `}
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>The TikTok Creator Calculator Team</p>
          </div>
          <div class="footer">
            <p>© 2024 TikTok Creator Calculator. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Welcome to TikTok Creator Calculator!
      
      Hi ${data.name}!
      
      Thank you for joining TikTok Creator Calculator! We're excited to help you estimate your potential earnings as a TikTok creator.
      
      With our advanced calculator, you can:
      - Calculate potential monthly and yearly earnings
      - Analyze different revenue streams
      - Get personalized tips to increase your income
      - Save and track your calculations
      
      ${data.verificationUrl ? `
        To get started, please verify your email address by visiting:
        ${data.verificationUrl}
      ` : `
        You can start using the calculator at:
        ${process.env.NEXT_PUBLIC_APP_URL}
      `}
      
      If you have any questions, feel free to reach out to our support team.
      
      Best regards,
      The TikTok Creator Calculator Team
      
      © 2024 TikTok Creator Calculator. All rights reserved.
      If you didn't create this account, please ignore this email.
    `;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * 发送密码重置邮件
   */
  async sendPasswordResetEmail(to: string, data: {
    name: string;
    resetUrl: string;
    expiresIn: string;
  }): Promise<void> {
    const subject = 'Reset Your Password - TikTok Creator Calculator';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #ff6b6b;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            <p>We received a request to reset your password for your TikTok Creator Calculator account.</p>
            
            <p>Click the button below to reset your password:</p>
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in ${data.expiresIn}. If you don't reset your password within this time, you'll need to request a new reset link.
            </div>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>For security reasons, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Not sharing your password with anyone</li>
              <li>Enabling two-factor authentication if available</li>
            </ul>
            
            <p>If you're having trouble with the button above, copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
            
            <p>Best regards,<br>The TikTok Creator Calculator Team</p>
          </div>
          <div class="footer">
            <p>© 2024 TikTok Creator Calculator. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Password Reset Request - TikTok Creator Calculator
      
      Hi ${data.name}!
      
      We received a request to reset your password for your TikTok Creator Calculator account.
      
      To reset your password, visit the following link:
      ${data.resetUrl}
      
      IMPORTANT: This link will expire in ${data.expiresIn}. If you don't reset your password within this time, you'll need to request a new reset link.
      
      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      
      For security reasons, we recommend:
      - Using a strong, unique password
      - Not sharing your password with anyone
      - Enabling two-factor authentication if available
      
      Best regards,
      The TikTok Creator Calculator Team
      
      © 2024 TikTok Creator Calculator. All rights reserved.
      This is an automated email. Please do not reply.
    `;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * 发送邮箱验证邮件
   */
  async sendEmailVerificationEmail(to: string, data: {
    name: string;
    verificationUrl: string;
    expiresIn: string;
  }): Promise<void> {
    const subject = 'Verify Your Email Address - TikTok Creator Calculator';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10ac84 0%, #00d2d3 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #10ac84;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .info {
              background: #d1ecf1;
              border: 1px solid #bee5eb;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Verify Your Email Address</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            <p>Thank you for creating an account with TikTok Creator Calculator! To complete your registration, please verify your email address.</p>
            
            <p>Click the button below to verify your email:</p>
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            
            <div class="info">
              <strong>Note:</strong> This verification link will expire in ${data.expiresIn}. If the link expires, you can request a new verification email from your account settings.
            </div>
            
            <p>Once your email is verified, you'll be able to:</p>
            <ul>
              <li>Save your calculation results</li>
              <li>Access your calculation history</li>
              <li>Receive important updates and tips</li>
              <li>Reset your password if needed</li>
            </ul>
            
            <p>If you're having trouble with the button above, copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
            
            <p>If you didn't create this account, please ignore this email.</p>
            
            <p>Best regards,<br>The TikTok Creator Calculator Team</p>
          </div>
          <div class="footer">
            <p>© 2024 TikTok Creator Calculator. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Verify Your Email Address - TikTok Creator Calculator
      
      Hi ${data.name}!
      
      Thank you for creating an account with TikTok Creator Calculator! To complete your registration, please verify your email address.
      
      To verify your email, visit the following link:
      ${data.verificationUrl}
      
      NOTE: This verification link will expire in ${data.expiresIn}. If the link expires, you can request a new verification email from your account settings.
      
      Once your email is verified, you'll be able to:
      - Save your calculation results
      - Access your calculation history
      - Receive important updates and tips
      - Reset your password if needed
      
      If you didn't create this account, please ignore this email.
      
      Best regards,
      The TikTok Creator Calculator Team
      
      © 2024 TikTok Creator Calculator. All rights reserved.
      This is an automated email. Please do not reply.
    `;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * 发送反馈确认邮件
   */
  async sendFeedbackConfirmationEmail(to: string, data: {
    name: string;
    subject: string;
    message: string;
    ticketId: string;
  }): Promise<void> {
    const subject = `Feedback Received - ${data.subject} [#${data.ticketId}]`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #5f27cd 0%, #341f97 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .ticket {
              background: #e9ecef;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Feedback Received</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            <p>Thank you for your feedback! We've received your message and will review it carefully.</p>
            
            <div class="ticket">
              <h3>Your Feedback Details:</h3>
              <p><strong>Ticket ID:</strong> #${data.ticketId}</p>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${data.message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p>We typically respond to feedback within 24-48 hours. If your message requires immediate attention, please don't hesitate to reach out to us directly.</p>
            
            <p>Your feedback helps us improve TikTok Creator Calculator for everyone. We appreciate you taking the time to share your thoughts with us.</p>
            
            <p>Best regards,<br>The TikTok Creator Calculator Team</p>
          </div>
          <div class="footer">
            <p>© 2024 TikTok Creator Calculator. All rights reserved.</p>
            <p>Reference: #${data.ticketId}</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Feedback Received - TikTok Creator Calculator
      
      Hi ${data.name}!
      
      Thank you for your feedback! We've received your message and will review it carefully.
      
      Your Feedback Details:
      Ticket ID: #${data.ticketId}
      Subject: ${data.subject}
      Message: ${data.message}
      
      We typically respond to feedback within 24-48 hours. If your message requires immediate attention, please don't hesitate to reach out to us directly.
      
      Your feedback helps us improve TikTok Creator Calculator for everyone. We appreciate you taking the time to share your thoughts with us.
      
      Best regards,
      The TikTok Creator Calculator Team
      
      © 2024 TikTok Creator Calculator. All rights reserved.
      Reference: #${data.ticketId}
    `;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * 发送通知邮件给管理员
   */
  async sendAdminNotificationEmail(data: {
    type: 'feedback' | 'error' | 'user_registration' | 'other';
    subject: string;
    content: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('Admin email not configured');
      return;
    }

    const subject = `[TikTok Calculator] ${data.subject}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #2c3e50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 0 0 5px 5px;
            }
            .metadata {
              background: #e9ecef;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              font-family: monospace;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Admin Notification</h1>
            <p>Type: ${data.type.toUpperCase()}</p>
          </div>
          <div class="content">
            <h2>${data.subject}</h2>
            <div>${data.content.replace(/\n/g, '<br>')}</div>
            
            ${data.metadata ? `
              <div class="metadata">
                <h3>Metadata:</h3>
                <pre>${JSON.stringify(data.metadata, null, 2)}</pre>
              </div>
            ` : ''}
            
            <p><em>Generated at: ${new Date().toISOString()}</em></p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Admin Notification - TikTok Creator Calculator
      
      Type: ${data.type.toUpperCase()}
      Subject: ${data.subject}
      
      Content:
      ${data.content}
      
      ${data.metadata ? `
        Metadata:
        ${JSON.stringify(data.metadata, null, 2)}
      ` : ''}
      
      Generated at: ${new Date().toISOString()}
    `;

    await this.sendEmail({
      to: adminEmail,
      subject,
      html,
      text,
    });
  }

  /**
   * 测试邮件连接
   */
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}

// 创建全局实例
export const emailService = new EmailService();

/**
 * 初始化邮件服务
 */
export const initializeEmailService = async (): Promise<void> => {
  try {
    await emailService.initialize();
  } catch (error) {
    console.error('Failed to initialize email service:', error);
    // 不抛出错误，允许应用继续运行
  }
};

/**
 * 便捷的邮件发送函数
 */
export const sendEmail = {
  welcome: (to: string, data: { name: string; verificationUrl?: string }) => {
    return emailService.sendWelcomeEmail(to, data);
  },
  
  passwordReset: (to: string, data: { name: string; resetUrl: string; expiresIn: string }) => {
    return emailService.sendPasswordResetEmail(to, data);
  },
  
  emailVerification: (to: string, data: { name: string; verificationUrl: string; expiresIn: string }) => {
    return emailService.sendEmailVerificationEmail(to, data);
  },
  
  feedbackConfirmation: (to: string, data: { name: string; subject: string; message: string; ticketId: string }) => {
    return emailService.sendFeedbackConfirmationEmail(to, data);
  },
  
  adminNotification: (data: { type: 'feedback' | 'error' | 'user_registration' | 'other'; subject: string; content: string; metadata?: Record<string, any> }) => {
    return emailService.sendAdminNotificationEmail(data);
  },
};

export default emailService;