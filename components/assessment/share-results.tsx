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

interface ShareResultsProps {
  assessmentId: string;
  totalScore: number;
  level: number;
  organizationName: string;
  className?: string;
}

export function ShareResults({ 
  assessmentId, 
  totalScore, 
  level, 
  organizationName,
  className 
}: ShareResultsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: `${organizationName} - Insider Risk Assessment Results`,
    message: `Hi,\n\nI wanted to share our organization's insider risk assessment results with you.\n\nOverall Score: ${totalScore}/100 (Level ${level})\nOrganization: ${organizationName}\n\nYou can view the full results at: ${window?.location?.origin}/results/${assessmentId}\n\nBest regards`
  });

  const resultsUrl = typeof window !== 'undefined' ? 
    `${window.location.origin}/results/${assessmentId}` : 
    `https://insiderisk.io/results/${assessmentId}`;

  const shareText = `Our organization scored ${totalScore}/100 (Level ${level}) on the Insider Risk Index assessment. Check out your organization's insider risk posture at insiderisk.io`;

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
    // This would trigger PDF generation
    const pdfUrl = `/api/pdf/board-brief/${assessmentId}`;
    window.open(pdfUrl, '_blank');
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
                <div className="text-2xl font-bold text-above-blue-800">{totalScore}</div>
                <div className="text-sm text-above-blue-800">Overall Score</div>
              </div>
              <div>
                <Badge className="bg-above-blue-100 text-above-blue-800 border-above-blue-200">
                  Level {level}
                </Badge>
                <div className="text-sm text-above-blue-800 mt-1">Maturity Level</div>
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
                Share on Social Media
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnLinkedIn}
                  className="flex-1"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
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