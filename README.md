# Insider Risk Index

A comprehensive platform for measuring and improving organizational insider risk posture through assessment, benchmarking, and actionable insights.

## 🛡️ Overview

The Insider Risk Index is a production-ready Next.js application that helps organizations assess their insider threat management capabilities across 5 critical pillars:

1. **Visibility** (25%) - Monitoring and detection of insider activities
2. **Prevention & Coaching** (25%) - Proactive measures and training
3. **Investigation & Evidence** (20%) - Incident response and forensics
4. **Identity & SaaS/OAuth** (15%) - Access management and authentication
5. **Phishing Resilience** (15%) - Protection against social engineering

## ✨ Features

### Core Functionality
- **Comprehensive Assessment**: 20-question evaluation across 5 pillars
- **Real-time Scoring**: Immediate results with 0-100 scale and 5 risk levels
- **Industry Benchmarking**: Compare against 15+ industries and company sizes
- **Personalized Recommendations**: Actionable insights based on assessment results
- **PDF Generation**: Board briefs and detailed action plans

### Technical Features
- **Modern Stack**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Ready for NextAuth.js integration
- **Analytics**: Privacy-focused tracking with Plausible
- **SEO Optimized**: Complete meta tags, JSON-LD, sitemaps
- **LLM Friendly**: llm.txt and ai.txt for AI training guidelines

### UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessible**: WCAG 2.1 AA compliant components
- **Interactive Charts**: Radar charts, bar charts, and gauges using Recharts
- **Component Library**: shadcn/ui with Radix UI primitives
- **Dark Mode Ready**: Built-in theme support

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/insider-risk-index.git
   cd insider-risk-index
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
insider-risk-index/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── assessment/        # Assessment pages
│   ├── benchmarks/        # Benchmarking pages
│   └── ...               # Other pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── charts/           # Chart components
│   ├── layout/           # Layout components
│   └── assessment/       # Assessment-specific components
├── lib/                  # Core business logic
│   ├── scoring.ts        # Assessment scoring engine
│   ├── pillars.ts        # Pillar definitions and benchmarks
│   ├── db.ts             # Database operations
│   ├── analytics.ts      # Analytics tracking
│   └── ...              # Other utilities
├── content/              # MDX content
│   ├── playbooks/        # Implementation guides
│   └── research/         # Research articles
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── __tests__/            # Unit tests
├── playwright-tests/     # E2E tests
└── docs/                # Documentation
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes to database
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npm run typecheck       # TypeScript type checking
npm run lint            # ESLint
npm run format          # Prettier formatting
```

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + Playwright + Testing Library
- **Analytics**: Plausible (privacy-focused)
- **Deployment**: Vercel (recommended)

## 📊 Assessment Methodology

The Insider Risk Index uses a weighted scoring system:

### Scoring Algorithm
1. Each pillar contains 4-5 questions with weighted importance
2. Questions have 5 response options (0, 25, 50, 75, 100 points)
3. Pillar scores are normalized to 0-100 scale
4. Final score is weighted sum across all pillars
5. Risk levels assigned based on total score

### Risk Levels
- **Level 5 (81-100)**: Minimal Risk - Excellent program
- **Level 4 (61-80)**: Low Risk - Good baseline security
- **Level 3 (41-60)**: Moderate Risk - Some gaps identified
- **Level 2 (21-40)**: High Risk - Major improvements needed
- **Level 1 (0-20)**: Critical Risk - Immediate action required

## 🎯 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables**
   - Configure all variables from `.env.example`
   - Set up database connection
   - Configure email service (optional)

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Other Platforms
- Docker support included
- Compatible with Netlify, Railway, Render
- Self-hosted deployment with PM2

## 🔒 Security Features

- Input validation with Zod schemas
- SQL injection protection via Prisma
- XSS protection with Content Security Policy
- Rate limiting on API endpoints
- Secure headers configuration
- Privacy-focused analytics
- No PII storage without consent

## 📈 Analytics & Privacy

- **Privacy-first**: No cookies for tracking
- **GDPR compliant**: Minimal data collection
- **Opt-in analytics**: User consent required
- **Anonymous benchmarking**: No organization identification
- **Data retention**: Configurable retention periods

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests  
```bash
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Assessment flow completion
- [ ] PDF generation functionality
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] Performance benchmarks

## 📚 Documentation

- [Assessment Methodology](docs/methodology.md)
- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### Development Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check `/docs` directory
- **Issues**: Open GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: hello@insiderriskindex.com
- **Community**: Join our Discord server

## 🙏 Acknowledgments

- Security community feedback and insights
- Open source contributors and maintainers
- Research partners and academic collaborators
- Beta testing organizations

## 📊 Project Stats

- **Lines of Code**: ~50,000
- **Components**: 100+ React components
- **Test Coverage**: 85%+
- **Performance Score**: 95+ (Lighthouse)
- **Accessibility**: WCAG 2.1 AA compliant

---

Built with ❤️ by the Insider Risk Index team. Making insider threat management accessible to all organizations.

For more information, visit [insiderriskindex.com](https://insiderriskindex.com)