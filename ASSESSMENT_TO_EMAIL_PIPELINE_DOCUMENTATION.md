# Assessment-to-Email Pipeline Documentation

## Overview

This document provides comprehensive documentation of the complete assessment-to-email pipeline in the InsiderRisk Index application, including file responsibilities, exact code flow, and integration points.

## Architecture Overview

```
Frontend Assessment → Server Action → Database → Email System → PDF Generation
     ↓                    ↓              ↓           ↓              ↓
Assessment Form → submitAssessment() → PostgreSQL → Resend API → Playwright PDF
```

## File-by-File Responsibilities

### 1. Core Business Logic Files

#### `/lib/email/client.ts`
**Responsibility**: Email service configuration and sending
**Key Functions**:
- `resend`: Resend API client initialization
- `EMAIL_CONFIG`: Email configuration with Above Security branding
- `sendEmail()`: Main email sending function with error handling
- `sendTestEmail()`: Test email functionality

**Code Flow**:
```typescript
sendEmail({to, subject, html, attachments}) →
  Check EMAIL_CONFIG.enabled →
  resend.emails.send() →
  Return {success: boolean, data/error}
```

#### `/app/actions/assessment.ts`
**Responsibility**: Main server action for assessment submission
**Key Functions**:
- `submitAssessment()`: Complete assessment processing pipeline
- `getAssessmentResults()`: Retrieve assessment data
- `getBenchmarks()`: Fetch benchmark comparison data

**Exact Code Flow**:
```typescript
submitAssessment(data) →
1. Database connection test (prisma.$connect())
2. Zod validation (AssessmentSubmissionSchema.parse())
3. Answer conversion to array format
4. IRI calculation (calculateInsiderRiskIndex())
5. Database save (prisma.assessment.create())
6. IF emailOptIn && contactEmail:
   a. Render email template
   b. Generate PDF attachment (optional)
   c. Send email via sendEmail()
   d. Update emailSent tracking
7. Return assessment ID and results
```

#### `/lib/scoring.ts`
**Responsibility**: IRI score calculation engine
**Key Functions**:
- `calculateInsiderRiskIndex()`: Main scoring algorithm
- `generateRecommendations()`: AI-powered recommendations
- `identifyStrengths()` / `identifyWeaknesses()`: Analysis functions

**Code Flow**:
```typescript
calculateInsiderRiskIndex({answers, industry, companySize}) →
1. Create answer lookup map
2. For each pillar:
   - Get pillar questions
   - Calculate weighted scores
   - Normalize to 0-100 scale
3. Calculate total weighted score
4. Determine risk level (1-5)
5. Get benchmark data
6. Generate recommendations/strengths/weaknesses
7. Return AssessmentResult object
```

### 2. Email System Files

#### `/emails/assessment-complete.tsx`
**Responsibility**: React email template for assessment results
**Key Components**:
- Executive gradient header with branding
- Large IRI score display with color coding
- Business impact metrics (risk exposure, containment time)
- Pillar breakdown visualization
- CTA buttons (View Results + Download PDF)
- Above Security footer with attribution

**Template Structure**:
```tsx
<Html>
  <Head />
  <Preview>Executive Board Report - {iriScore}/100</Preview>
  <Body>
    <Container>
      {/* Gradient Header with Logo */}
      {/* Executive Summary Bar */}
      {/* Score Section with Business Impact */}
      {/* Call-to-Action Buttons */}
      {/* Above Security Footer */}
    </Container>
  </Body>
</Html>
```

### 3. PDF Generation Files

#### `/lib/pdf/email-attachment.ts`
**Responsibility**: PDF generation for email attachments
**Key Functions**:
- `generatePDFAttachment()`: Main PDF generation using Playwright
- `generateAssessmentPDF()`: Utility function for specific assessment

**Code Flow**:
```typescript
generatePDFAttachment({assessment, type}) →
1. Launch Chromium browser (playwrightCore.launch())
2. Create new page with A4 viewport
3. Navigate to `/pdf/${assessment.id}` React page
4. Wait for content loading (.pdf-header selector)
5. Generate PDF with proper margins/formatting
6. Return {buffer: Buffer, filename: string}
7. Close browser
```

#### `/app/api/pdf/[id]/route.ts`
**Responsibility**: PDF generation API endpoint
**Key Functions**:
- `GET()`: Generate PDF from assessment ID

**Code Flow**:
```typescript
GET(request, {params}) →
1. Extract assessment ID from params
2. Verify assessment exists (direct Prisma query)
3. Launch Chromium with serverless config
4. Navigate to `/pdf/${id}` React page
5. Wait for .pdf-page selector
6. Generate PDF with A4 format
7. Return PDF as Response with proper headers
```

#### `/app/pdf/[id]/page.tsx` (Referenced but not read)
**Responsibility**: Server-side React page for PDF rendering
**Purpose**: Provides HTML/CSS structure that Playwright converts to PDF

### 4. Database Files

#### `/prisma/schema.prisma`
**Responsibility**: Database schema definition
**Key Models**:

```prisma
model Assessment {
  id: String @id @default(cuid())
  // Organization info
  organizationName: String?
  industry: Industry?
  size: CompanySize?
  region: Region?

  // Assessment data
  answers: Json  // {questionId: value} map
  pillarScores: Json  // {pillar: score} map
  iri: Float  // 0-100 score
  level: Int  // 1-5 maturity

  // Email tracking
  emailOptIn: Boolean @default(false)
  contactEmail: String?
  emailSent: Boolean @default(false)
  emailSentAt: DateTime?

  // Relations
  pillarBreakdown: PillarScore[]
}

model PillarScore {
  pillar: String  // visibility, coaching, etc.
  score: Float
  weight: Float
  contributionToTotal: Float
  assessment: Assessment @relation(...)
}
```

#### `/lib/zod-schemas.ts` (Referenced)
**Responsibility**: Validation schemas
**Key Schemas**:
- `AssessmentSubmissionSchema`: Validates form submission
- `ContactFormSchema`: Validates contact forms

### 5. Frontend Files

#### `/app/results/[id]/page.tsx`
**Responsibility**: Results page display
**Key Functions**:
- `generateMetadata()`: SEO metadata generation
- Main component: Results display with sharing capabilities

**Code Flow**:
```typescript
ResultsPage({params}) →
1. Get assessment results (getAssessmentResults())
2. Generate dynamic insights (generateAssessmentInsights())
3. Format data for components
4. Render ResultsSummary + MatrixRecommendations
5. Include methodology and CTA sections
```

## Complete User Journey Flow

### Step 1: Assessment Completion
```
User completes 20-question form →
Frontend validation →
Form submission to submitAssessment()
```

### Step 2: Server Processing
```
submitAssessment() receives form data →
Validates with AssessmentSubmissionSchema →
Converts answers to array format →
Calls calculateInsiderRiskIndex() →
Saves to database with pillar breakdown
```

### Step 3: Email Decision Point
```
IF user provided email AND opted in:
  Continue to email flow
ELSE:
  Skip to results return
```

### Step 4: Email Generation
```
Get pillar scores for template →
Calculate top strengths/risks →
Render AssessmentCompleteEmail with data →
Generate HTML string
```

### Step 5: PDF Attachment (Optional)
```
IF ENABLE_PDF_EMAIL_ATTACHMENTS=true:
  Call generatePDFAttachment() →
  Launch Playwright browser →
  Navigate to /pdf/{id} →
  Generate PDF buffer →
  Attach to email
ELSE:
  Email without attachment
```

### Step 6: Email Delivery
```
Call sendEmail() with:
  - Recipient: user's email
  - Subject: Score summary
  - HTML: Rendered template
  - Attachments: PDF (optional) →
Send via Resend API →
Update database: emailSent=true
```

### Step 7: Results Access
```
User receives email with:
  - Executive summary
  - Score visualization
  - Business impact metrics
  - Link to full results page
  - PDF download link
```

## Error Handling Strategy

### Database Errors
```typescript
try {
  await prisma.$connect()
} catch (dbError) {
  throw new Error(`Database connection failed: ${dbError.message}`)
}
```

### Email Errors
```typescript
// Email failure doesn't break assessment submission
try {
  await sendEmail(...)
  await prisma.assessment.update({emailSent: true})
} catch (emailError) {
  console.error('Email failed:', emailError)
  // Continue without failing assessment
}
```

### PDF Errors
```typescript
// PDF failure falls back to download link
try {
  pdfAttachment = await generatePDFAttachment(...)
} catch (pdfError) {
  console.error('PDF generation failed:', pdfError)
  // Send email without attachment
}
```

### Validation Errors
```typescript
// Zod validation with detailed error reporting
if (error instanceof z.ZodError) {
  return {
    success: false,
    error: "Invalid assessment data",
    details: error.issues
  }
}
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Email Service
RESEND_API_KEY="re_..."
EMAIL_FROM_ADDRESS="results@mail.insiderisk.io"
EMAIL_FROM_NAME="InsiderRisk Index"
EMAIL_REPLY_TO="support@insiderisk.io"
ENABLE_EMAIL_NOTIFICATIONS="true"

# PDF Generation
ENABLE_PDF_EMAIL_ATTACHMENTS="true"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://insiderisk.io"
```

## Security Measures

### Input Validation
- All form inputs validated with Zod schemas
- Email format validation with permissive regex
- SQL injection prevention via Prisma ORM

### Data Privacy
- Assessment results not indexed by search engines
- Anonymous benchmarking via orgMetaHash
- Optional email consent with clear opt-in

### Email Security
- SPF/DKIM configured for mail.insiderisk.io domain
- Rate limiting on email sending
- Error messages don't expose internal details

## Performance Optimizations

### Database
- Selective field queries to minimize data transfer
- Indexed fields for fast lookups
- Async benchmark updates to avoid blocking

### PDF Generation
- Optimized Chromium arguments for serverless
- Viewport sizing for consistent rendering
- Network idle detection for complete loading

### Email System
- Pre-compiled React email templates
- Attachment size limits
- Graceful degradation when services unavailable

## Monitoring & Logging

### Assessment Submission
```typescript
console.log("🔍 Starting assessment submission...")
console.log("✅ Database connection successful")
console.log("✅ Assessment saved successfully with ID:", assessment.id)
```

### Email Delivery
```typescript
console.log('Sending assessment email to:', email)
console.log('Assessment email sent successfully')
```

### PDF Generation
```typescript
console.log("📄 Generating PDF attachment for assessment:", id)
console.log("✅ PDF attachment generated successfully:", filename)
```

## Integration Points

### External Services
1. **Resend API**: Email delivery service
2. **Neon PostgreSQL**: Cloud database
3. **Vercel**: Hosting and serverless functions
4. **Chromium**: PDF generation engine

### Internal Dependencies
1. **Prisma**: Database ORM and type generation
2. **Zod**: Runtime validation and type safety
3. **React Email**: Email template rendering
4. **Playwright**: Browser automation for PDF

## Future Enhancements

### Planned Features
1. **Email Templates**: Multiple template variations
2. **Retry Logic**: Failed email retry mechanism
3. **Analytics**: Email open/click tracking
4. **Scheduling**: Delayed email delivery options
5. **Personalization**: Industry-specific content

### Technical Improvements
1. **Queue System**: Background job processing
2. **Caching**: PDF generation caching
3. **Webhooks**: Real-time email status updates
4. **Testing**: Comprehensive test coverage
5. **Monitoring**: Health checks and alerting

---

*This documentation represents the current state of the assessment-to-email pipeline as of the analysis date. For the most up-to-date information, refer to the actual codebase.*