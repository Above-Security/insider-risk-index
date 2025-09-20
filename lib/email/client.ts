import { Resend } from 'resend';

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
  console.warn('RESEND_API_KEY is not set. Email notifications will not work.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email configuration
export const EMAIL_CONFIG = {
  from: {
    address: process.env.EMAIL_FROM_ADDRESS || 'results@mail.insiderisk.io',
    name: process.env.EMAIL_FROM_NAME || 'InsiderRisk Index'
  },
  replyTo: process.env.EMAIL_REPLY_TO || 'support@insiderisk.io',
  enabled: process.env.ENABLE_EMAIL_NOTIFICATIONS?.trim() === 'true' && !!resendApiKey
};

// Helper function to format from address
export function getFromAddress(): string {
  return `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.address}>`;
}

// Email sending wrapper with error handling
export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
}) {
  if (!EMAIL_CONFIG.enabled || !resend) {
    console.log('Email notifications disabled or not configured');
    return { success: false, error: 'Email notifications not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: getFromAddress(),
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject,
      html,
      text,
      attachments,
    });

    console.log('Email sent successfully:', {
      id: result.data?.id,
      to: Array.isArray(to) ? to : [to],
      subject
    });

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Test email functionality
export async function sendTestEmail(to: string) {
  return sendEmail({
    to,
    subject: 'Test Email - InsiderRisk Index',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #E94A5D;">Email Configuration Test</h1>
        <p>If you're receiving this email, your InsiderRisk Index email configuration is working correctly!</p>
        <p style="color: #666; font-size: 14px;">
          Sent from: ${EMAIL_CONFIG.from.address}<br>
          Reply to: ${EMAIL_CONFIG.replyTo}<br>
          Timestamp: ${new Date().toISOString()}
        </p>
      </div>
    `,
    text: 'Email configuration test successful!'
  });
}