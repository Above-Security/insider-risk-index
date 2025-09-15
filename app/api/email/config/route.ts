import { NextResponse } from "next/server";
import { EMAIL_CONFIG, resend } from "@/lib/email/client";

export async function GET() {
  const config = {
    enabled: EMAIL_CONFIG.enabled,
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    fromAddress: EMAIL_CONFIG.from.address,
    fromName: EMAIL_CONFIG.from.name,
    replyTo: EMAIL_CONFIG.replyTo,
    enableNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS,
    resendInitialized: !!resend
  };

  return NextResponse.json(config);
}