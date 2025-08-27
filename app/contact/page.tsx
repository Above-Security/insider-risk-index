"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AboveLogo } from "@/components/ui/above-logo";
import { 
  Mail, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  ExternalLink
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo: Array<{
    icon: any;
    title: string;
    details: string;
    description: string;
    isLink?: boolean;
  }> = [
    {
      icon: Mail,
      title: "General Inquiries",
      details: "aviv@abovesec.com",
      description: "Business inquiries and partnerships",
    },
    {
      icon: Building2,
      title: "Above Security",
      details: "abovesec.com",
      description: "Comprehensive insider threat protection solutions",
      isLink: true,
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Tel Aviv District, Israel",
      description: "Headquarters and operations",
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "24-48 hours",
      description: "Typical response time",
    },
  ];

  const useCases = [
    "Questions about the insider risk assessment",
    "Partnership and collaboration opportunities",
    "Above Security enterprise solutions",
    "Media and press inquiries",
    "Security research collaboration",
    "Speaking engagements and conferences",
    "Venture capital and investment discussions",
    "Technical due diligence consulting",
  ];

  return (
    <div className="min-h-screen bg-above-blue-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <AboveLogo size="lg" className="text-slate-900 opacity-100 w-24 h-20 mx-auto mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Contact Above Security
            </h1>
          </div>
          <p className="mt-4 text-xl text-slate-600">
            Get in touch with Above Security about insider threat protection solutions and enterprise security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="What can we help you with?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  {submitStatus === "success" && (
                    <Alert variant="success">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Thank you for your message! We&apos;ll get back to you within 24-48 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Sorry, there was an error sending your message. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-above-blue-100 rounded-lg">
                        <item.icon className="h-5 w-5 text-above-blue-800" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      {item.isLink ? (
                        <a 
                          href={`https://${item.details}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-above-blue-800 font-medium hover:text-above-blue-600 transition-colors flex items-center gap-1"
                        >
                          {item.details}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : item.title === "General Inquiries" ? (
                        <a 
                          href={`mailto:${item.details}`}
                          className="text-above-blue-800 font-medium hover:text-above-blue-600 transition-colors"
                        >
                          {item.details}
                        </a>
                      ) : (
                        <p className="text-above-blue-800 font-medium">{item.details}</p>
                      )}
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle>We can help with:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {useCases.map((useCase, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-above-blue-500 rounded-full flex-shrink-0" />
                      <p className="text-slate-700">{useCase}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About Above Security */}
            <Card className="bg-above-blue-50 border-above-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="h-5 w-5 text-above-blue-800" />
                  <h3 className="font-semibold text-above-blue-900">About Above Security</h3>
                </div>
                <p className="text-above-blue-800 text-sm mb-4">
                  Above Security provides comprehensive insider threat protection solutions, specializing in 
                  AI-powered cybersecurity and advanced threat detection. We help organizations detect, 
                  investigate, and respond to insider risks with cutting-edge technology.
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-above-blue-300 text-above-blue-800 hover:bg-above-blue-100"
                    onClick={() => window.open('https://abovesec.com', '_blank')}
                  >
                    Visit Website
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-above-blue-300 text-above-blue-800 hover:bg-above-blue-100"
                    onClick={() => window.open('https://www.linkedin.com/company/abovesec/', '_blank')}
                  >
                    LinkedIn
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <div className="bg-above-blue-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Response Time</h3>
              </div>
              <p className="text-slate-700 text-sm">
                We typically respond to all inquiries within 24-48 hours during business hours 
                (Monday-Friday, 9 AM - 6 PM EST).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}