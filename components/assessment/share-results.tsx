"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Copy, 
  Mail, 
  Download,
  CheckCircle,
  ExternalLink,
  Linkedin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateShareableUrl, createShareableData } from "@/lib/share-utils";

interface ShareResultsProps {
  result: {
    totalScore: number;
    level: number;
    levelDescription: string;
  };
  organizationName: string;
  organizationInfo?: {
    industry: string;
    employeeCount: string;
  };
  answers?: Record<string, number>;
  className?: string;
}

export function ShareResults({ 
  result, 
  organizationName,
  organizationInfo,
  answers,
  className 
}: ShareResultsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: `${organizationName} - Insider Risk Assessment Results`,
    message: `Hi,\n\nI wanted to share our organization's insider risk assessment results with you.\n\nOverall Score: ${result.totalScore}/100 (Level ${result.level})\nOrganization: ${organizationName}\n\nWe achieved "${result.levelDescription}" maturity level. Learn more about insider risk assessment at abovesec.com\n\nBest regards`
  });

  // Generate shareable URL if we have the necessary data
  const resultsUrl = (() => {
    if (answers && organizationInfo) {
      try {
        const shareableData = createShareableData(
          answers,
          organizationName,
          organizationInfo.industry,
          organizationInfo.employeeCount
        );
        return generateShareableUrl(shareableData);
      } catch (error) {
        console.error('Error generating shareable URL:', error);
        // Fallback to generic URL
      }
    }
    
    // Fallback URL when answers aren't available
    return typeof window !== 'undefined' ? 
      `${window.location.origin}/assessment` : 
      `https://abovesec.com/assessment`;
  })();

  const shareText = `Our organization scored ${result.totalScore}/100 (Level ${result.level}) on the Insider Risk Index assessment. Check out your organization's insider risk posture at abovesec.com`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaEmail = () => {
    const mailtoUrl = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    window.open(mailtoUrl);
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resultsUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  const generatePDFShare = () => {
    // This would trigger PDF generation - for now, link to assessment page
    window.open('/assessment', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Assessment Results</DialogTitle>
          <DialogDescription>
            Share your insider risk assessment results with stakeholders
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="p-4 bg-above-blue-50 rounded-lg">
            <h4 className="font-semibold text-above-blue-900 mb-2">{organizationName}</h4>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-above-blue-800">{result.totalScore}</div>
                <div className="text-sm text-above-blue-800">Overall Score</div>
              </div>
              <div>
                <Badge className="bg-above-blue-100 text-above-blue-800 border-above-blue-200">
                  Level {result.level}
                </Badge>
                <div className="text-sm text-above-blue-800 mt-1">{result.levelDescription}</div>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-url" className="text-sm font-medium">
                Results URL
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="share-url"
                  value={resultsUrl}
                  readOnly
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(resultsUrl)}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-above-blue-800" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Social Media Sharing */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Share Professional Achievement
              </Label>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnLinkedIn}
                  className="justify-start bg-[#0A66C2] hover:bg-[#004182] text-white border-[#0A66C2] hover:border-[#004182]"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                  <div className="ml-auto text-xs opacity-75">Professional</div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`🎯 Just completed our insider risk assessment! Scored ${result.totalScore}/100 (Level ${result.level}) - ${result.levelDescription}. \n\nEvery organization should understand their insider risk posture. Check out abovesec.com to assess yours! \n\n#CyberSecurity #InsiderThreat #RiskManagement`)}
                  className="justify-start"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Social Post
                  <div className="ml-auto text-xs opacity-75">Any platform</div>
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💡 Share your security leadership and raise awareness about insider risk management
              </p>
            </div>

            {/* Email Sharing */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Send via Email
              </Label>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email-to" className="text-xs text-slate-600">
                    To:
                  </Label>
                  <Input
                    id="email-to"
                    placeholder="recipient@example.com"
                    value={emailData.to}
                    onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email-subject" className="text-xs text-slate-600">
                    Subject:
                  </Label>
                  <Input
                    id="email-subject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email-message" className="text-xs text-slate-600">
                    Message:
                  </Label>
                  <Textarea
                    id="email-message"
                    value={emailData.message}
                    onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                    className="text-sm min-h-[100px] resize-none"
                  />
                </div>
                
                <Button
                  onClick={shareViaEmail}
                  disabled={!emailData.to}
                  className="w-full"
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>

            {/* PDF Download */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Download & Share PDF
              </Label>
              <Button
                variant="outline"
                onClick={generatePDFShare}
                className="w-full"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Board Brief PDF
              </Button>
            </div>

            {/* Privacy Notice */}
            <Alert>
              <AlertDescription className="text-xs">
                <strong>Privacy Note:</strong> Shared links provide read-only access to your assessment results. 
                No personal data is exposed beyond what you choose to share.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}