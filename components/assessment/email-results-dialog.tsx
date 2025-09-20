"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmailResultsDialogProps {
  assessmentId: string;
  className?: string;
}

export function EmailResultsDialog({ assessmentId, className }: EmailResultsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  // Always include attachment if environment variable is set

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast.error("Please enter a recipient email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/email-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessmentId,
          recipientEmail,
          recipientName: recipientName || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Assessment results sent successfully to ${recipientEmail}!`);
        setOpen(false);
        // Reset form
        setRecipientEmail("");
        setRecipientName("");
      } else {
        toast.error(data.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Email send error:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 h-16 text-lg border-2 border-above-blue-200 hover:bg-above-blue-50 ${className}`}
          size="lg"
        >
          <Mail className="h-6 w-6" />
          Email Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-above-blue-700" />
            Email Assessment Results
          </DialogTitle>
          <DialogDescription>
            Share your assessment results with team members, stakeholders, or colleagues.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Recipient Email *</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="colleague@company.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-name">Your Name (optional)</Label>
            <Input
              id="recipient-name"
              type="text"
              placeholder="John Smith"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-slate-500">
              Will be included in the email subject line
            </p>
          </div>

        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={loading || !recipientEmail}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}