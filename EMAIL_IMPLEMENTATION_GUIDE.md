# Email Implementation Guide for InsiderRisk Index

## 📋 Table of Contents
1. [Pre-Implementation Checklist](#pre-implementation-checklist)
2. [Phase 1: Planning & Research](#phase-1-planning--research)
3. [Phase 2: Service Selection](#phase-2-service-selection)
4. [Phase 3: Domain Setup](#phase-3-domain-setup)
5. [Phase 4: Implementation](#phase-4-implementation)
6. [Phase 5: Testing](#phase-5-testing)
7. [Phase 6: Monitoring](#phase-6-monitoring)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Pre-Implementation Checklist

### What You Need Before Starting
- [ ] Access to Cloudflare DNS management for `insiderisk.io`
- [ ] Vercel project access (for environment variables)
- [ ] Credit card for email service (most have free tiers)
- [ ] 2-3 hours of uninterrupted time for initial setup
- [ ] Test email addresses (Gmail, Outlook, Yahoo for testing)

### Current System Status
- [ ] PostHog analytics is configured and working
- [ ] Assessment form captures email addresses
- [ ] PDF generation is functional
- [ ] Database can store email status

---

## Phase 1: Planning & Research

### 1.1 Determine Email Volume
```
Current estimates:
- Daily assessments: ~10-50
- Email types: Assessment results, Follow-ups
- Monthly volume: ~300-1500 emails
- Growth projection: 3x in 6 months
```

### 1.2 Research Email Providers

| Provider | Free Tier | Setup Complexity | Best For | Research Links |
|----------|-----------|------------------|----------|----------------|
| **Resend** | 3,000/month | Easy | Developers, Next.js | [resend.com/pricing](https://resend.com/pricing) |
| **SendGrid** | 100/day | Medium | Scale, Analytics | [sendgrid.com/pricing](https://sendgrid.com/pricing) |
| **Postmark** | 100/month | Easy | Transactional only | [postmarkapp.com](https://postmarkapp.com) |
| **AWS SES** | Pay-per-use | Hard | High volume, Cost | [aws.amazon.com/ses](https://aws.amazon.com/ses) |
| **Cloudflare Email** | Workers-based | Medium | Existing CF users | [developers.cloudflare.com/email-routing](https://developers.cloudflare.com/email-routing) |

### 1.3 Internet Research Tasks
```bash
# Google these exact phrases for latest info:
"Resend vs SendGrid 2024 comparison"
"Next.js email service best practices 2024"
"Transactional email deliverability tips"
"DMARC policy configuration guide"
"Email authentication SPF DKIM setup"

# Check these communities:
Reddit: r/nextjs, r/webdev (search "email service")
Dev.to: Search "nextjs email 2024"
GitHub: Look for similar projects using email
```

---

## Phase 2: Service Selection

### 2.1 Decision Matrix

```typescript
// Evaluate based on your needs:
const emailServiceCriteria = {
  cost: 'How much at 1,000 emails/month?',
  setupTime: 'Can you implement in 1 day?',
  nextjsSupport: 'Native Next.js integration?',
  reactEmail: 'Supports React Email templates?',
  analytics: 'Open/click tracking included?',
  support: '24/7 support available?',
  scalability: 'Easy to scale to 100k emails?'
};
```

### 2.2 Recommended: Start with Resend
**Why Resend for MVP:**
- Built for developers
- React Email support
- Simple API
- Good free tier
- Next.js examples available

### 2.3 Sign Up Process
1. Go to [resend.com/signup](https://resend.com/signup)
2. Use your `@insiderisk.io` email if possible
3. Verify your account
4. **DO NOT add domain yet** (we'll do this properly)

---

## Phase 3: Domain Setup

### 3.1 Cloudflare DNS Configuration

#### Step 1: Plan Your Email Addresses
```yaml
Transactional Emails:
  results@mail.insiderisk.io     # Assessment results
  notifications@mail.insiderisk.io # General notifications
  
Support/Replies:
  support@insiderisk.io          # Customer support
  hello@insiderisk.io            # General inbox
  
System:
  noreply@mail.insiderisk.io    # No-reply address
```

#### Step 2: Add Domain in Email Service
1. Log into Resend Dashboard
2. Go to Domains → Add Domain
3. Enter: `mail.insiderisk.io`
4. Copy the DNS records provided

#### Step 3: Configure Cloudflare DNS

**⚠️ CRITICAL: All email DNS records must have Proxy OFF (gray cloud)**

```dns
# In Cloudflare Dashboard → DNS → Records

# 1. SPF Record
Type: TXT
Name: mail
Content: "v=spf1 include:amazonses.com ~all"
Proxy: OFF (DNS only)
TTL: Auto

# 2. DKIM Records (3 records from Resend)
Type: CNAME
Name: resend._domainkey.mail
Content: [value from Resend dashboard]
Proxy: OFF (DNS only)
TTL: Auto

# 3. DMARC Record (start with p=none)
Type: TXT
Name: _dmarc.mail
Content: "v=DMARC1; p=none; rua=mailto:dmarc@insiderisk.io; ruf=mailto:dmarc@insiderisk.io; pct=100"
Proxy: OFF (DNS only)
TTL: Auto
```

#### Step 4: Verify Domain
1. Return to Resend dashboard
2. Click "Verify DNS Records"
3. Wait 5-30 minutes for propagation
4. All checks should turn green

### 3.2 Email Receiving Setup (Optional)
```yaml
Cloudflare Email Routing (Free):
1. Go to Email → Email Routing in Cloudflare
2. Enable Email Routing
3. Add routes:
   support@insiderisk.io → your-personal@gmail.com
   hello@insiderisk.io → your-personal@gmail.com
```

---

## Phase 4: Implementation

### 4.1 Environment Variables
```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=results@mail.insiderisk.io
EMAIL_FROM_NAME=InsiderRisk Index
EMAIL_REPLY_TO=support@insiderisk.io
NEXT_PUBLIC_SITE_URL=https://insiderisk.io
```

### 4.2 Install Dependencies
```bash
npm install resend @react-email/components
npm install --save-dev @types/node
```

### 4.3 Create Email Service
```typescript
// lib/email/client.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: {
    address: process.env.EMAIL_FROM_ADDRESS || 'results@mail.insiderisk.io',
    name: process.env.EMAIL_FROM_NAME || 'InsiderRisk Index'
  },
  replyTo: process.env.EMAIL_REPLY_TO || 'support@insiderisk.io'
};
```

### 4.4 Create Email Template
```typescript
// emails/assessment-complete.tsx
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AssessmentCompleteEmailProps {
  organizationName: string;
  iriScore: number;
  maturityLevel: string;
  resultsUrl: string;
  pdfUrl: string;
}

export function AssessmentCompleteEmail({
  organizationName,
  iriScore,
  maturityLevel,
  resultsUrl,
  pdfUrl
}: AssessmentCompleteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Insider Risk Assessment Score: {iriScore}/100</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Assessment Complete!</Heading>
          
          <Section>
            <Text style={text}>Hi {organizationName},</Text>
            <Text style={text}>
              Your Insider Risk Index assessment is complete. Here's your score:
            </Text>
            
            <Section style={scoreSection}>
              <Text style={scoreText}>{iriScore}/100</Text>
              <Text style={levelText}>{maturityLevel}</Text>
            </Section>
            
            <Link href={resultsUrl} style={button}>
              View Full Results
            </Link>
            
            <Link href={pdfUrl} style={secondaryButton}>
              Download PDF Report
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const scoreSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const scoreText = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#E94A5D',
  margin: '0',
};

const levelText = {
  fontSize: '18px',
  color: '#666',
  margin: '8px 0',
};

const button = {
  backgroundColor: '#E94A5D',
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '12px 20px',
  margin: '16px auto',
  width: '200px',
};

const secondaryButton = {
  ...button,
  backgroundColor: '#fff',
  color: '#E94A5D',
  border: '2px solid #E94A5D',
};
```

### 4.5 Integration with Assessment
```typescript
// app/actions/assessment.ts
import { resend, EMAIL_CONFIG } from '@/lib/email/client';
import { AssessmentCompleteEmail } from '@/emails/assessment-complete';

export async function submitAssessment(data: AssessmentSubmission) {
  // ... existing assessment logic ...
  
  // Send email if provided
  if (validated.contactEmail) {
    try {
      const emailHtml = await renderToString(
        <AssessmentCompleteEmail
          organizationName={validated.organizationName}
          iriScore={scoringResult.totalScore}
          maturityLevel={scoringResult.levelName}
          resultsUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/results/${assessment.id}`}
          pdfUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/api/pdf/detailed/${assessment.id}`}
        />
      );
      
      await resend.emails.send({
        from: `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.address}>`,
        to: validated.contactEmail,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: `Your Insider Risk Assessment Score: ${scoringResult.totalScore}/100`,
        html: emailHtml,
      });
      
      // Update database
      await prisma.assessment.update({
        where: { id: assessment.id },
        data: { 
          emailSent: true,
          emailSentAt: new Date()
        }
      });
      
      console.log('Email sent successfully to:', validated.contactEmail);
    } catch (error) {
      console.error('Email send failed:', error);
      // Don't fail the assessment if email fails
    }
  }
  
  return { success: true, assessmentId: assessment.id };
}
```

---

## Phase 5: Testing

### 5.1 Local Testing Setup
```typescript
// lib/email/test.ts
export async function testEmailSetup() {
  console.log('Testing email configuration...');
  
  // 1. Check environment variables
  const checks = {
    api_key: !!process.env.RESEND_API_KEY,
    from_address: !!process.env.EMAIL_FROM_ADDRESS,
    site_url: !!process.env.NEXT_PUBLIC_SITE_URL,
  };
  
  console.log('Environment checks:', checks);
  
  // 2. Verify domain
  try {
    const domains = await resend.domains.list();
    console.log('Verified domains:', domains);
  } catch (error) {
    console.error('Domain verification failed:', error);
  }
  
  // 3. Send test email
  try {
    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.address}>`,
      to: 'your-test-email@gmail.com',
      subject: 'Test Email - InsiderRisk Setup',
      html: '<p>If you receive this, email is working!</p>'
    });
    console.log('Test email sent:', result);
  } catch (error) {
    console.error('Test email failed:', error);
  }
}

// Run with: npm run test:email
```

### 5.2 Testing Checklist
```markdown
## Email Testing Checklist

### Basic Functionality
- [ ] Test email sends successfully
- [ ] Email arrives within 2 minutes
- [ ] From address displays correctly
- [ ] Subject line is correct
- [ ] Reply-to address works

### Content Testing
- [ ] HTML renders correctly
- [ ] Links are clickable and correct
- [ ] Score displays properly
- [ ] Organization name appears
- [ ] Mobile responsive

### Deliverability Testing
- [ ] Test with Gmail
- [ ] Test with Outlook/Hotmail
- [ ] Test with Yahoo
- [ ] Test with corporate email
- [ ] Check spam folder
- [ ] Run through mail-tester.com

### Edge Cases
- [ ] Invalid email handling
- [ ] Network timeout handling
- [ ] Rate limiting behavior
- [ ] Duplicate prevention
```

### 5.3 Deliverability Testing Tools
```bash
# 1. Mail Tester (Check spam score)
https://www.mail-tester.com/
# Send test email to provided address
# Aim for score > 8/10

# 2. MXToolbox (Verify DNS)
https://mxtoolbox.com/SuperTool.aspx
# Check: SPF, DKIM, DMARC for mail.insiderisk.io

# 3. Google Postmaster Tools
https://postmaster.google.com/
# Add and verify domain for reputation monitoring

# 4. Email on Acid (Rendering tests)
https://www.emailonacid.com/
# Test how email looks across clients
```

---

## Phase 6: Monitoring

### 6.1 Setup Monitoring
```typescript
// lib/email/monitoring.ts
export async function monitorEmailHealth() {
  // Daily health check
  const metrics = {
    sent_today: 0,
    failed_today: 0,
    bounce_rate: 0,
    complaint_rate: 0,
    avg_delivery_time: 0
  };
  
  // Check recent emails
  const recentEmails = await prisma.emailLog.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  });
  
  // Calculate metrics
  metrics.sent_today = recentEmails.filter(e => e.status === 'sent').length;
  metrics.failed_today = recentEmails.filter(e => e.status === 'failed').length;
  
  // Alert if issues
  if (metrics.failed_today > metrics.sent_today * 0.1) {
    console.error('High failure rate detected:', metrics);
    // Send alert to team
  }
  
  return metrics;
}
```

### 6.2 PostHog Email Events
```typescript
// Track email events in PostHog
posthog.capture('email_sent', {
  type: 'assessment_results',
  recipient_domain: email.split('@')[1],
  has_pdf: true,
  assessment_id: assessmentId
});

posthog.capture('email_failed', {
  type: 'assessment_results',
  error: error.message,
  assessment_id: assessmentId
});
```

### 6.3 Monitoring Dashboard
```yaml
Key Metrics to Track:
- Delivery rate (target: >95%)
- Open rate (target: >40% for transactional)
- Bounce rate (target: <2%)
- Complaint rate (target: <0.1%)
- Time to delivery (target: <2 minutes)

Weekly Reviews:
- Check Resend dashboard for trends
- Review PostHog email events
- Check spam reports
- Monitor domain reputation
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Emails going to spam
```markdown
Solutions:
1. Check mail-tester.com score
2. Ensure SPF, DKIM, DMARC are configured
3. Avoid spam trigger words in subject
4. Include text version of email
5. Add unsubscribe link
6. Warm up sending gradually
```

#### Issue: DNS verification failing
```markdown
Solutions:
1. Ensure Cloudflare proxy is OFF for email records
2. Wait 30 minutes for propagation
3. Check for typos in DNS records
4. Use `dig` command to verify:
   dig TXT mail.insiderisk.io
```

#### Issue: Emails not sending
```markdown
Debugging steps:
1. Check API key is correct
2. Verify domain is verified in Resend
3. Check for rate limiting
4. Review error logs
5. Test with simple text email first
```

#### Issue: Slow email delivery
```markdown
Solutions:
1. Check email queue processing
2. Verify no rate limiting
3. Consider upgrading plan
4. Implement retry logic
5. Use background jobs
```

---

## Best Practices

### 1. Email Content
- Keep subject lines under 50 characters
- Personalize with organization name
- Include clear CTA buttons
- Provide text alternative
- Test on multiple devices

### 2. Deliverability
- Start with low volume and ramp up
- Monitor bounce and complaint rates
- Keep email lists clean
- Use double opt-in for marketing
- Separate transactional from marketing

### 3. Security
- Never log full email addresses
- Use environment variables for secrets
- Implement rate limiting
- Validate email addresses
- Add CAPTCHA for public forms

### 4. Performance
- Send emails asynchronously
- Implement retry logic
- Use email queues for bulk
- Cache email templates
- Monitor sending limits

### 5. Compliance
- Include unsubscribe links
- Honor unsubscribe requests immediately
- Keep records of consent
- Follow CAN-SPAM/GDPR rules
- Add privacy policy link

---

## Implementation Timeline

### Week 1: Setup & Basic Implementation
- Day 1: Research and select provider
- Day 2: Domain setup and DNS configuration
- Day 3: Basic email sending implementation
- Day 4: Template creation
- Day 5: Testing and debugging

### Week 2: Enhancement & Monitoring
- Day 6-7: Error handling and retry logic
- Day 8: Analytics integration
- Day 9: Monitoring setup
- Day 10: Documentation and team training

### Week 3: Optimization
- Performance tuning
- Deliverability improvements
- A/B testing setup
- Scaling preparation

---

## Resources & References

### Official Documentation
- [Resend Docs](https://resend.com/docs)
- [React Email](https://react.email)
- [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing)
- [DMARC.org](https://dmarc.org)

### Tutorials & Guides
- [Next.js Email Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#sending-emails)
- [Email Deliverability Guide](https://www.mailgun.com/blog/deliverability/email-deliverability-guide/)
- [SPF/DKIM/DMARC Explained](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)

### Communities & Support
- [Resend Discord](https://discord.gg/resend)
- [React Email GitHub](https://github.com/resendlabs/react-email)
- [r/emailmarketing](https://reddit.com/r/emailmarketing)

---

## Notes for Future Development

### Phase 2 Features
- Email templates for different scenarios
- Scheduled follow-up emails
- Drip campaigns for nurturing
- Team sharing notifications
- Benchmark update alerts

### Advanced Features
- Email preference center
- A/B testing framework
- Advanced analytics
- Multi-language support
- Email archiving system

---

*Last Updated: [Current Date]*
*Version: 1.0.0*
*Status: Ready for Implementation*