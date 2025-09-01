import { Card, CardContent } from "@/components/ui/card";
import { getPageLayout, getSectionLayout } from "@/lib/layout-utils";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Insider Risk Index",
  description: "Terms and conditions for using the Insider Risk Index assessment platform and services.",
};

export default function TermsPage() {
  const lastUpdated = "January 27, 2025";
  const effectiveDate = "January 1, 2025";
  
  return (
    <div className="min-h-screen bg-above-gradient-light">
      <div className={`${getPageLayout()} ${getSectionLayout('lg')}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-8">
            Terms of Service
          </h1>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-sm text-slate-600 mb-6">
                <strong>Last Updated:</strong> {lastUpdated}<br />
                <strong>Effective Date:</strong> {effectiveDate}
              </p>
              
              <div className="prose prose-slate max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                  <p className="text-slate-700 mb-4">
                    By accessing or using the Insider Risk Index website and services ("Service") 
                    operated by Insider Risk Index ("we," "us," or "our"), you agree to be bound by 
                    these Terms of Service ("Terms"). If you disagree with any part of these terms, 
                    you do not have permission to access the Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                  <p className="text-slate-700 mb-4">
                    Insider Risk Index provides a free online assessment tool that helps organizations 
                    evaluate their insider threat risk posture. The Service includes:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Security risk assessment questionnaires</li>
                    <li>Risk scoring and analysis</li>
                    <li>Industry benchmarking comparisons</li>
                    <li>Recommendations and best practices</li>
                    <li>Educational resources and research</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>
                  
                  <h3 className="text-xl font-medium mb-3">3.1 Permitted Use</h3>
                  <p className="text-slate-700 mb-4">You may use the Service for:</p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Conducting organizational risk assessments</li>
                    <li>Educational and research purposes</li>
                    <li>Improving your security posture</li>
                    <li>Benchmarking against industry standards</li>
                  </ul>

                  <h3 className="text-xl font-medium mb-3">3.2 Prohibited Use</h3>
                  <p className="text-slate-700 mb-4">You agree NOT to:</p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Use the Service for any unlawful purpose or to solicit illegal activities</li>
                    <li>Attempt to probe, scan, or test vulnerabilities of our systems</li>
                    <li>Breach or circumvent any security or authentication measures</li>
                    <li>Access or attempt to access data not intended for you</li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>Transmit viruses, malware, or harmful code</li>
                    <li>Scrape, spider, or use automated systems to access the Service</li>
                    <li>Misrepresent your affiliation with any person or entity</li>
                    <li>Violate any applicable laws or regulations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property Rights</h2>
                  
                  <h3 className="text-xl font-medium mb-3">4.1 Our Content</h3>
                  <p className="text-slate-700 mb-4">
                    The Service and its original content, features, and functionality are owned by 
                    Insider Risk Index and are protected by international copyright, trademark, patent, 
                    trade secret, and other intellectual property laws. Our trademarks may not be used 
                    without prior written consent.
                  </p>

                  <h3 className="text-xl font-medium mb-3">4.2 Your Content</h3>
                  <p className="text-slate-700 mb-4">
                    You retain ownership of any data you input into the Service. By using the Service, 
                    you grant us a limited license to process your data solely for providing the Service 
                    to you.
                  </p>

                  <h3 className="text-xl font-medium mb-3">4.3 Third-Party Content</h3>
                  <p className="text-slate-700 mb-4">
                    Some content is sourced from third parties including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Ponemon Institute research data</li>
                    <li>Verizon Data Breach Investigations Report</li>
                    <li>Gartner research and analysis</li>
                    <li>ForScie Insider Threat Matrix</li>
                  </ul>
                  <p className="text-slate-700 mb-4">
                    Such content is used with permission or under fair use and retains its original ownership.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
                  <p className="text-slate-700 mb-4">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, 
                    EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Warranties of merchantability</li>
                    <li>Fitness for a particular purpose</li>
                    <li>Non-infringement</li>
                    <li>Accuracy, reliability, or completeness of content</li>
                    <li>Uninterrupted or error-free operation</li>
                  </ul>
                  <p className="text-slate-700 mb-4">
                    <strong>Security Advisory:</strong> The assessments and recommendations provided are for 
                    informational purposes only and should not be considered as professional security consulting. 
                    We recommend engaging qualified security professionals for comprehensive risk assessment 
                    and mitigation strategies.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                  <p className="text-slate-700 mb-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, INSIDER RISK INDEX SHALL NOT BE LIABLE FOR:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                    <li>Damages resulting from your use or inability to use the Service</li>
                    <li>Any unauthorized access to or alteration of your data</li>
                    <li>Any third-party content or conduct on the Service</li>
                    <li>Any security breaches or cyber incidents affecting your organization</li>
                  </ul>
                  <p className="text-slate-700 mb-4">
                    Our total liability shall not exceed $100 USD or the amount you paid us in the past 
                    twelve months, whichever is greater.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">7. Indemnification</h2>
                  <p className="text-slate-700 mb-4">
                    You agree to defend, indemnify, and hold harmless Insider Risk Index, its affiliates, 
                    and their respective officers, directors, employees, and agents from any claims, damages, 
                    obligations, losses, liabilities, costs, or expenses (including attorney's fees) arising from:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-slate-700">
                    <li>Your use of and access to the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Any content you submit to the Service</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
                  <p className="text-slate-700 mb-4">
                    Your use of the Service is also governed by our{" "}
                    <Link href="/privacy" className="text-above-rose-700 hover:underline">
                      Privacy Policy
                    </Link>
                    . By using the Service, you consent to our collection and use of data as described 
                    in the Privacy Policy.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">9. Modifications to Service and Terms</h2>
                  
                  <h3 className="text-xl font-medium mb-3">9.1 Service Changes</h3>
                  <p className="text-slate-700 mb-4">
                    We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) 
                    at any time without notice. We shall not be liable to you or any third party for any 
                    modification, suspension, or discontinuance.
                  </p>

                  <h3 className="text-xl font-medium mb-3">9.2 Terms Changes</h3>
                  <p className="text-slate-700 mb-4">
                    We may revise these Terms at any time. Material changes will be notified via the Service 
                    or email (if provided). Continued use after changes constitutes acceptance of new Terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                  <p className="text-slate-700 mb-4">
                    We may terminate or suspend your access to the Service immediately, without prior notice 
                    or liability, for any reason, including if you breach these Terms. Upon termination, your 
                    right to use the Service will immediately cease.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">11. Governing Law and Disputes</h2>
                  
                  <h3 className="text-xl font-medium mb-3">11.1 Governing Law</h3>
                  <p className="text-slate-700 mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of the 
                    United States and the State of Delaware, without regard to conflict of law provisions.
                  </p>

                  <h3 className="text-xl font-medium mb-3">11.2 Dispute Resolution</h3>
                  <p className="text-slate-700 mb-4">
                    Any disputes arising from these Terms or the Service shall be resolved through binding 
                    arbitration in accordance with the rules of the American Arbitration Association. The 
                    arbitration shall be conducted in Delaware, and judgment may be entered in any court 
                    of competent jurisdiction.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">12. General Provisions</h2>
                  
                  <h3 className="text-xl font-medium mb-3">12.1 Entire Agreement</h3>
                  <p className="text-slate-700 mb-4">
                    These Terms constitute the entire agreement between you and Insider Risk Index regarding 
                    the Service and supersede all prior agreements and understandings.
                  </p>

                  <h3 className="text-xl font-medium mb-3">12.2 Severability</h3>
                  <p className="text-slate-700 mb-4">
                    If any provision of these Terms is found to be unenforceable, the remaining provisions 
                    shall continue in full force and effect.
                  </p>

                  <h3 className="text-xl font-medium mb-3">12.3 Waiver</h3>
                  <p className="text-slate-700 mb-4">
                    No waiver of any term shall be deemed a further or continuing waiver of such term or 
                    any other term.
                  </p>

                  <h3 className="text-xl font-medium mb-3">12.4 Assignment</h3>
                  <p className="text-slate-700 mb-4">
                    You may not assign or transfer these Terms without our prior written consent. We may 
                    assign our rights and obligations without restriction.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
                  <p className="text-slate-700 mb-4">
                    For questions about these Terms of Service, please contact us:
                  </p>
                  <ul className="list-none mb-4 text-slate-700">
                    <li><strong>Email:</strong> legal@insiderisk.io</li>
                    <li><strong>Website:</strong> <Link href="/contact" className="text-above-rose-700 hover:underline">Contact Form</Link></li>
                    <li><strong>Address:</strong> Legal Department, Insider Risk Index</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">14. Sponsorship Acknowledgment</h2>
                  <p className="text-slate-700 mb-4">
                    This Service is sponsored by{" "}
                    <a href="https://abovesec.com" target="_blank" rel="noopener noreferrer" className="text-above-rose-700 hover:underline">
                      Above Security
                    </a>
                    . The sponsorship enables us to provide this Service free of charge. Above Security 
                    is not responsible for the Service's operation or content unless explicitly stated.
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