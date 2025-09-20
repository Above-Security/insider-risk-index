import { Resend } from 'resend';

// Initialize Resend client with comprehensive logging
const resendApiKey = process.env.RESEND_API_KEY?.trim();

console.log('🔧 Email System Initialization:', {
  hasResendApiKey: !!resendApiKey,
  resendApiKeyLength: resendApiKey?.length || 0,
  resendApiKeyPrefix: resendApiKey?.substring(0, 8) || 'none',
  enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS,
  enableEmailNotificationsTrimmed: process.env.ENABLE_EMAIL_NOTIFICATIONS?.trim(),
  nodeEnv: process.env.NODE_ENV,
  fromAddressRaw: process.env.EMAIL_FROM_ADDRESS,
  fromAddressTrimmed: process.env.EMAIL_FROM_ADDRESS?.trim(),
  fromNameRaw: process.env.EMAIL_FROM_NAME,
  fromNameTrimmed: process.env.EMAIL_FROM_NAME?.trim(),
  replyToRaw: process.env.EMAIL_REPLY_TO,
  replyToTrimmed: process.env.EMAIL_REPLY_TO?.trim(),
});

if (!resendApiKey && process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
  console.warn('⚠️ RESEND_API_KEY is not set. Email notifications will not work.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email configuration
export const EMAIL_CONFIG = {
  from: {
    address: process.env.EMAIL_FROM_ADDRESS?.trim() || 'results@mail.insiderisk.io',
    name: process.env.EMAIL_FROM_NAME?.trim() || 'InsiderRisk Index'
  },
  replyTo: process.env.EMAIL_REPLY_TO?.trim() || 'support@insiderisk.io',
  enabled: process.env.ENABLE_EMAIL_NOTIFICATIONS?.trim() === 'true' && !!resendApiKey
};

console.log('📧 Email Configuration:', {
  ...EMAIL_CONFIG,
  enabled: EMAIL_CONFIG.enabled,
  resendClientInitialized: !!resend
});

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
  console.log('📧 sendEmail function called with:', {
    to: Array.isArray(to) ? to : [to],
    subject,
    htmlLength: html.length,
    hasText: !!text,
    attachmentsCount: attachments?.length || 0,
    emailConfigEnabled: EMAIL_CONFIG.enabled,
    hasResendClient: !!resend
  });

  if (!EMAIL_CONFIG.enabled || !resend) {
    console.log('📧 Email notifications disabled or not configured:', {
      enabled: EMAIL_CONFIG.enabled,
      hasResend: !!resend,
      resendApiKey: !!process.env.RESEND_API_KEY
    });
    return { success: false, error: 'Email notifications not configured' };
  }

  try {
    console.log('📧 Preparing Resend API call with:', {
      from: getFromAddress(),
      to: Array.isArray(to) ? to : [to],
      replyTo: EMAIL_CONFIG.replyTo,
      subject,
      htmlPreview: html.substring(0, 100) + '...',
      hasAttachments: !!attachments && attachments.length > 0
    });

    const result = await resend.emails.send({
      from: getFromAddress(),
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject,
      html,
      text,
      attachments,
    });

    console.log('✅ Resend API response received:', {
      success: true,
      resultData: result.data,
      resultError: result.error,
      id: result.data?.id,
      to: Array.isArray(to) ? to : [to],
      subject
    });

    if (result.error) {
      console.error('❌ Resend returned an error:', {
        error: result.error,
        errorMessage: result.error.message,
        errorName: result.error.name
      });
      return {
        success: false,
        error: result.error.message || 'Resend API error'
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Failed to send email - exception thrown:', {
      error: error instanceof Error ? error.message : error,
      errorType: error?.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined,
      to: Array.isArray(to) ? to : [to],
      subject
    });
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