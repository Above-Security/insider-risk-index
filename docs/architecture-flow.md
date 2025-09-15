# Assessment Submission & PDF Generation Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Assessment Wizard (/assessment)                                         │
│ ├── Organization Form (industry, size, region)                         │
│ ├── Optional Contact Email Field                                       │
│ ├── Email Opt-in Checkbox (appears when email provided)                │
│ ├── Include in Benchmarks Checkbox (separate concern)                  │
│ ├── 20 Question Cards (5 pillars × 4 questions)                        │
│ └── Progress Tracking (real-time completion %)                         │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ Form Submission
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SERVER ACTION LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│ submitAssessment() - app/actions/assessment.ts                         │
│ ├── 1. Validate with Zod Schema                                        │
│ ├── 2. Calculate IRI Score (weighted pillars)                          │
│ ├── 3. Generate Organization Hash (privacy)                            │
│ ├── 4. Save to PostgreSQL Database                                     │
│ └── 5. Conditional Email Trigger                                       │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ PostgreSQL + Prisma ORM                                                │
│ ├── Assessment Table (main results)                                    │
│ ├── PillarScore Table (breakdown)                                      │
│ ├── BenchmarkSnapshot Table (comparisons)                              │
│ └── Email Tracking (emailSent, emailSentAt)                            │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EMAIL FLOW                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ IF (emailOptIn && contactEmail)                                        │
│ ├── Render React Email Template                                        │
│ ├── Generate PDF Attachment (optional)                                 │
│ │   └── generatePDFAttachment() → Playwright                          │
│ ├── Send via Resend API                                               │
│ └── Update Database (emailSent: true)                                 │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PDF GENERATION                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ TWO GENERATION PATHS:                                                   │
│                                                                         │
│ PATH A: Email Attachment (Sync - 30s timeout)                         │
│ ├── lib/pdf/email-attachment.ts                                       │
│ ├── Playwright → Navigate to /pdf/[id]                                │
│ ├── Render React Components                                           │
│ └── Return Buffer to Email                                             │
│                                                                         │
│ PATH B: Direct Download (Async - 60s timeout)                         │
│ ├── /api/pdf/[id]/route.ts                                           │
│ ├── Playwright → Navigate to /pdf/[id]                                │
│ ├── Enhanced Content + Matrix Mapping                                 │
│ └── Stream PDF to Browser                                              │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        RESULTS PAGE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ /results/[id] - Dynamic Assessment Results                             │
│ ├── Radar Chart (5 pillars)                                           │
│ ├── Maturity Level Badge                                               │
│ ├── Industry Benchmarks                                                │
│ ├── Matrix Recommendations                                             │
│ ├── PDF Download Button                                                │
│ └── Social Sharing Options                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

## Performance Characteristics

### Serverless Function Timeouts (Vercel)
```
Email Generation:     ~8-12 seconds  (within 30s hobby limit)
PDF Email Attachment: ~15-25 seconds (within 30s hobby limit)
Direct PDF Download:  ~20-45 seconds (within 60s pro limit)
```

### Critical Path Dependencies
```
Assessment Submission → Database Save → Email (optional) → Results Page
                                    ↓
                              PDF Attachment (if enabled)
```

## Error Handling Strategy

### Graceful Degradation
```
Assessment Submission ✅ ALWAYS SUCCEEDS
         ↓
Database Save ✅ REQUIRED (blocks on failure)
         ↓
Email Send ⚠️ OPTIONAL (assessment continues on failure)
         ↓
PDF Attachment ⚠️ OPTIONAL (email sends without PDF on failure)
```

### Fallback Mechanisms
- Email failure → Assessment still completes
- PDF attachment failure → Email sends without PDF
- Direct PDF timeout → User can retry download
- Database error → Comprehensive error logging

## Security & Privacy

### Data Protection
```
Organization Data → SHA256 Hash (orgMetaHash)
Email Addresses → Encrypted storage
Assessment Answers → Local JSON storage
Benchmark Data → Anonymized aggregation
```

### Compliance Features
- GDPR: Explicit email opt-in required
- Privacy: No tracking without consent
- Security: CSP headers, input validation
- Audit: Complete email delivery logging