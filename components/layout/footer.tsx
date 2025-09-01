"use client";

import Link from "next/link";
import { Linkedin, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { LogoWithText } from "@/components/ui/logo";
import { AboveLogoWithText } from "@/components/ui/above-logo";
import { useState } from "react";

const navigation = {
  main: [
    { name: "Assessment", href: "/assessment" },
    { name: "Benchmarks", href: "/benchmarks" },
    { name: "Playbooks", href: "/playbooks" },
    { name: "Research", href: "/research" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  resources: [
    { name: "API Documentation", href: "/docs/api" },
    { name: "RSS Feed", href: "/rss.xml" },
    { name: "Sitemap", href: "/sitemap.xml" },
  ],
  social: [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/abovesec",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:hello@insiderisk.io",
      icon: Mail,
    },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'footer',
          consent: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Successfully subscribed!' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Subscription failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setIsLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ type: null, text: '' }), 5000);
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/">
              <LogoWithText 
                logoSize="lg"
                textSize="xl"
                color="above-blue"
                showFullText={true}
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Measure and improve your organization&apos;s insider risk posture with our comprehensive assessment platform.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-muted-foreground hover:text-above-blue-800 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-above-blue-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-above-blue-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-above-blue-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Newsletter signup */}
        <div className="mt-8 border-t pt-8">
          <form onSubmit={handleNewsletterSubmit}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-sm font-semibold text-foreground">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Get the latest research and insights on insider threats.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="min-w-0 flex-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  aria-label="Email address for newsletter"
                />
                {/* Honeypot field (hidden from users, catches bots) */}
                <input 
                  type="text" 
                  name="website" 
                  style={{ display: 'none' }} 
                  tabIndex={-1} 
                  autoComplete="off"
                  aria-hidden="true"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-none rounded-md bg-above-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-above-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </div>
            {/* Message display */}
            {message.type && (
              <div className={`mt-3 flex items-center gap-2 text-sm ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message.text}</span>
              </div>
            )}
          </form>
        </div>
        
        {/* Bottom section */}
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Insider Risk Index. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Research sponsored by</span>
            <a 
              href="https://abovesec.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-above-blue-800 transition-colors"
              aria-label="Above Security - Insider Threat Protection"
            >
              <AboveLogoWithText 
                size="lg" 
                textClassName="text-sm font-medium" 
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
            <span>&bull;</span>
            <Link href="/humans.txt" className="hover:text-above-blue-800 transition-colors">
              humans.txt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}