import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@/lib/zod-schemas";
import { ServerAnalytics } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data
    const validatedData = ContactFormSchema.parse(body);
    
    // Track the contact form submission
    await ServerAnalytics.trackEvent("contact_form_submitted", {
      company: validatedData.company,
      subscribe: validatedData.subscribe,
    });

    // In a production environment, you would:
    // 1. Send an email using a service like SendGrid, Resend, or NodeMailer
    // 2. Store the contact in a database for follow-up
    // 3. Send an auto-response email to the user
    
    // Example email sending (replace with your email service):
    /*
    await sendEmail({
      to: process.env.CONTACT_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Company:</strong> ${validatedData.company}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        <p><strong>Subscribe to newsletter:</strong> ${validatedData.subscribe ? 'Yes' : 'No'}</p>
      `
    });
    
    // Send auto-response to user
    await sendEmail({
      to: validatedData.email,
      from: process.env.FROM_EMAIL,
      subject: 'Thank you for contacting Insider Risk Index',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Hi ${validatedData.name},</p>
        <p>We've received your message and will get back to you within 24-48 hours.</p>
        <p>Best regards,<br>The Insider Risk Index Team</p>
      `
    });
    */

    // For now, we'll just log the submission and return success
    console.log("Contact form submission:", {
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company,
      message: validatedData.message.substring(0, 100) + "...",
      timestamp: new Date(),
    });

    return NextResponse.json(
      { message: "Thank you for your message. We'll get back to you soon!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form error:", error);
    
    return NextResponse.json(
      { error: "Failed to submit contact form. Please try again." },
      { status: 500 }
    );
  }
}