"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AboveButton } from "@/components/ui/above-components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@radix-ui/react-checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Building2, Users, Mail, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrganizationFormProps {
  onSubmit: (data: {
    organizationName: string;
    industry: string;
    employeeCount: string;
    contactEmail?: string;
    includeInBenchmarks: boolean;
  }) => void;
  className?: string;
}

const industries = [
  "financial-services",
  "healthcare",
  "technology",
  "manufacturing",
  "retail",
  "government",
  "education",
  "non-profit",
  "energy",
  "telecommunications",
  "transportation",
  "real-estate",
  "consulting",
  "media",
  "other",
];

const employeeCounts = [
  { value: "1-50", label: "1-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-1000", label: "201-1,000 employees" },
  { value: "1001-5000", label: "1,001-5,000 employees" },
  { value: "5000+", label: "5,000+ employees" },
];

export function OrganizationForm({ onSubmit, className }: OrganizationFormProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    industry: "",
    employeeCount: "",
    contactEmail: "",
    includeInBenchmarks: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Refs for focus management
  const firstInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  
  // Auto-focus first input on mount
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
    }

    if (!formData.industry) {
      newErrors.industry = "Please select an industry";
    }

    if (!formData.employeeCount) {
      newErrors.employeeCount = "Please select company size";
    }

    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };
  
  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto bg-above-white border-above-rose-100/30 shadow-soft ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-above-rose-100">
          <Shield className="h-6 w-6 text-above-rose-700" />
        </div>
        <CardTitle className="text-2xl text-slate-900">Organization Information</CardTitle>
        <p className="text-slate-700">
          Tell us about your organization to get personalized benchmark comparisons
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organization Name *
            </Label>
            <Input
              ref={firstInputRef}
              id="organizationName"
              type="text"
              placeholder="Enter your organization name"
              value={formData.organizationName}
              onChange={(e) => updateField("organizationName", e.target.value)}
              onFocus={() => handleFieldFocus("organizationName")}
              onBlur={handleFieldBlur}
              className={cn(
                "transition-all duration-200 focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2",
                errors.organizationName 
                  ? "border-above-rose-500 focus:border-above-rose-500" 
                  : "focus:border-above-rose-400",
                focusedField === "organizationName" && "ring-2 ring-above-rose-500 ring-offset-2"
              )}
              disabled={isSubmitting}
            />
            {errors.organizationName && (
              <p className="text-sm text-above-rose-600">{errors.organizationName}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select 
              value={formData.industry} 
              onValueChange={(value) => updateField("industry", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger 
                className={cn(
                  "transition-all duration-200 focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2",
                  errors.industry 
                    ? "border-above-rose-500 focus:border-above-rose-500" 
                    : "focus:border-above-rose-400"
                )}
                onFocus={() => handleFieldFocus("industry")}
                onBlur={handleFieldBlur}
              >
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry.split("-").map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-above-rose-600">{errors.industry}</p>
            )}
          </div>

          {/* Employee Count */}
          <div className="space-y-2">
            <Label htmlFor="employeeCount" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Company Size *
            </Label>
            <Select 
              value={formData.employeeCount} 
              onValueChange={(value) => updateField("employeeCount", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger 
                className={cn(
                  "transition-all duration-200 focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2",
                  errors.employeeCount 
                    ? "border-above-rose-500 focus:border-above-rose-500" 
                    : "focus:border-above-rose-400"
                )}
                onFocus={() => handleFieldFocus("employeeCount")}
                onBlur={handleFieldBlur}
              >
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {employeeCounts.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeCount && (
              <p className="text-sm text-above-rose-600">{errors.employeeCount}</p>
            )}
          </div>

          {/* Email (optional) */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Email (Optional)
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="your.email@company.com"
              value={formData.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              onFocus={() => handleFieldFocus("contactEmail")}
              onBlur={handleFieldBlur}
              className={cn(
                "transition-all duration-200 focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2",
                errors.contactEmail 
                  ? "border-above-rose-500 focus:border-above-rose-500" 
                  : "focus:border-above-rose-400"
              )}
              disabled={isSubmitting}
            />
            {errors.contactEmail && (
              <p className="text-sm text-above-rose-600">{errors.contactEmail}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Optional: Receive your detailed results and updates on new research
            </p>
          </div>

          {/* Benchmark inclusion */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg">
            <Checkbox
              id="includeInBenchmarks"
              checked={formData.includeInBenchmarks}
              onCheckedChange={(checked) => updateField("includeInBenchmarks", checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="includeInBenchmarks"
                className="text-sm font-medium cursor-pointer"
              >
                Include in benchmarks
              </Label>
              <p className="text-xs text-muted-foreground">
                Help improve industry benchmarks by anonymously including your results 
                in our aggregate data. Your organization will never be identified.
              </p>
            </div>
          </div>

          {/* Privacy note */}
          <div className="bg-above-blue-50 border border-above-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <Shield className="h-4 w-4 text-above-blue-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-above-blue-900">Privacy Commitment</p>
                <p className="text-xs text-above-blue-800 mt-1">
                  Your data is encrypted and secure. We never share individual results 
                  or identify specific organizations. Read our{" "}
                  <a href="/privacy" className="underline font-medium text-above-rose-700 hover:text-above-rose-800">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <AboveButton 
            ref={submitButtonRef}
            type="submit" 
            variant="default" 
            className="w-full focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 transition-all duration-200" 
            size="lg" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Starting Assessment...
              </>
            ) : (
              'Begin Assessment'
            )}
          </AboveButton>
        </CardFooter>
      </form>
    </Card>
  );
}