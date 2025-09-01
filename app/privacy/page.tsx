import { Card, CardContent } from "@/components/ui/card";
import { getPageLayout, getSectionLayout } from "@/lib/layout-utils";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Insider Risk Index",
  description: "Learn how Insider Risk Index collects, uses, and protects your data. Our commitment to privacy and data security.",
};

export default function PrivacyPage() {
  const lastUpdated = "January 27, 2025";
  
  return (
    <div className="min-h-screen bg-above-gradient-light">
      <div className={`${getPageLayout()} ${getSectionLayout('lg')}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-8">
            Privacy Policy
          </h1>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-sm text-slate-600 mb-6">
                <strong>Last Updated:</strong> {lastUpdated}
              </p>
              
              <div className="prose prose-slate max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-slate-700 mb-4">
                    Insider Risk Index ("we," "our," or "us") is committed to protecting your privacy. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                    when you use our website and assessment tools at insiderisk.io (the "Service").
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-medium mb-3">2.1 Assessment Data</h3>
                  <p className="text-slate-700 mb-4">
                    When you complete our insider risk assessment, we collect:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Organization size and industry (optional)</li>
                    <li>Assessment responses and scores</li>
                    <li>Generated risk index and recommendations</li>
                  </ul>
                  <p className="text-slate-700 mb-4">
                    <strong>Important:</strong> We do not require personally identifiable information to complete 
                    the assessment. All assessment data is stored locally in your browser unless you choose to 
                    share results.
                  </p>

                  <h3 className="text-xl font-medium mb-3">2.2 Contact Information</h3>
                  <p className="text-slate-700 mb-4">
                    If you choose to contact us or subscribe to updates, we may collect:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Email address</li>
                    <li>Name (optional)</li>
                    <li>Organization name (optional)</li>
                    <li>Message content</li>
                  </ul>

                  <h3 className="text-xl font-medium mb-3">2.3 Analytics Data</h3>
                  <p className="text-slate-700 mb-4">
                    We use PostHog for privacy-focused analytics to improve our service. This includes:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Page views and navigation patterns</li>
                    <li>Feature usage statistics</li>
                    <li>Device and browser information</li>
                    <li>General geographic location (country/region level)</li>
                  </ul>
                  <p className="text-slate-700 mb-4">
                    PostHog is configured to respect Do Not Track settings and does not collect personally 
                    identifiable information.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                  <p className="text-slate-700 mb-4">We use collected information to:</p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Generate your insider risk assessment results</li>
                    <li>Provide industry benchmarking comparisons</li>
                    <li>Improve our assessment methodology and recommendations</li>
                    <li>Respond to your inquiries and support requests</li>
                    <li>Send updates about new features or research (if subscribed)</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
                  <p className="text-slate-700 mb-4">
                    We implement appropriate technical and organizational security measures to protect your data:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Assessment data is primarily stored in your browser's local storage</li>
                    <li>Server infrastructure is hosted on secure, encrypted platforms</li>
                    <li>We use HTTPS encryption for all data transmission</li>
                    <li>Access to user data is restricted to authorized personnel only</li>
                    <li>We regularly review and update our security practices</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
                  <p className="text-slate-700 mb-4">
                    We do not sell, trade, or rent your personal information. We may share data only in these 
                    circumstances:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations or court orders</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>In connection with a business merger or acquisition (with notice)</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
                  
                  <h3 className="text-xl font-medium mb-3">6.1 Access and Control</h3>
                  <p className="text-slate-700 mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Access your personal data we hold</li>
                    <li>Correct inaccurate or incomplete data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to or restrict certain processing</li>
                    <li>Export your data in a portable format</li>
                  </ul>

                  <h3 className="text-xl font-medium mb-3">6.2 Opt-Out Options</h3>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Analytics: You can disable JavaScript or use browser privacy settings</li>
                    <li>Email: Unsubscribe links are included in all marketing emails</li>
                    <li>Cookies: Manage preferences through your browser settings</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
                  <p className="text-slate-700 mb-4">
                    We use minimal cookies and similar technologies:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand usage patterns (PostHog)</li>
                    <li><strong>Local Storage:</strong> Stores assessment progress and results locally</li>
                  </ul>
                  <p className="text-slate-700 mb-4">
                    You can control cookies through your browser settings. Note that disabling cookies may 
                    affect site functionality.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
                  <p className="text-slate-700 mb-4">
                    Our services are primarily hosted in the United States. If you access our Service from 
                    outside the US, please be aware that your data may be transferred to and processed in 
                    the US, which may have different data protection laws than your jurisdiction.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                  <p className="text-slate-700 mb-4">
                    Our Service is not intended for individuals under 16 years of age. We do not knowingly 
                    collect personal information from children. If we learn we have collected information 
                    from a child under 16, we will delete it promptly.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
                  <p className="text-slate-700 mb-4">
                    We may update this Privacy Policy periodically. We will notify you of material changes 
                    by posting the new policy on this page and updating the "Last Updated" date. Your 
                    continued use of the Service after changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
                  <p className="text-slate-700 mb-4">
                    For questions about this Privacy Policy or to exercise your rights, please contact us:
                  </p>
                  <ul className="list-none mb-4 text-slate-700">
                    <li><strong>Email:</strong> privacy@insiderisk.io</li>
                    <li><strong>Website:</strong> <Link href="/contact" className="text-above-rose-700 hover:underline">Contact Form</Link></li>
                    <li><strong>Response Time:</strong> Within 30 days of request</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">12. Sponsorship Disclosure</h2>
                  <p className="text-slate-700 mb-4">
                    This free assessment tool is sponsored by{" "}
                    <a href="https://abovesec.com" target="_blank" rel="noopener noreferrer" className="text-above-rose-700 hover:underline">
                      Above Security
                    </a>. Above Security does not receive or access individual assessment data unless 
                    explicitly shared by users through separate business engagement.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link 
              href="/"
              className="text-above-rose-700 hover:text-above-rose-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}