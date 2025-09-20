"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, BookOpen, FileText, Search, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboveButton } from "@/components/ui/above-components";
import { LogoWithText } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { LAYOUT_CONSTANTS } from "@/lib/layout-utils";

const navigation = [
  { name: "Assessment", href: "/assessment" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Benchmarks", href: "/benchmarks" },
  { name: "Matrix", href: "/matrix" },
  { name: "Resources", href: "/playbooks" },
  { name: "About", href: "/about" },
];

const mobileNavigation = [
  { name: "Assessment", href: "/assessment" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Benchmarks", href: "/benchmarks" },
  { name: "Matrix", href: "/matrix" },
  { name: "Playbooks", href: "/playbooks" },
  { name: "Research", href: "/research" },
  { name: "Glossary", href: "/glossary" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const resourcesNavigation = [
  { name: "Playbooks", href: "/playbooks", icon: BookOpen, description: "Implementation guides" },
  { name: "Research", href: "/research", icon: FileText, description: "Industry insights" },
  { name: "Glossary", href: "/glossary", icon: Search, description: "Security terminology" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Handle hover with delay for better UX
  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setResourcesOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setResourcesOpen(false);
    }, 300); // 300ms delay before hiding
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  return (
    <header className="bg-above-white/95 border-b border-above-rose-200 sticky top-0 z-50 backdrop-blur-lg shadow-sm">
      <nav className="mx-auto max-w-7xl flex items-center justify-between py-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="inline-flex items-center p-1.5 rounded-md hover:bg-above-rose-50"
        >
          <LogoWithText 
            logoSize="md"
            textSize="lg"
            color="above-rose"
            showFullText={true}
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-x-2 lg:gap-x-4">
          {navigation.map((item) => {
            if (item.name === "Resources") {
              return (
                <div key={item.name} className="relative">
                  <button
                    className={cn(
                      "text-sm font-medium py-2 px-2 lg:px-3 rounded-md transition-all duration-200 whitespace-nowrap inline-flex items-center gap-1.5",
                      resourcesNavigation.some(resource => pathname === resource.href)
                        ? "text-above-rose-700 bg-above-rose-100 font-semibold" 
                        : "text-slate-700 hover:text-above-rose-700 hover:bg-above-rose-50"
                    )}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Library className="w-4 h-4" />
                    {item.name}
                    <ChevronDown className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      resourcesOpen ? "rotate-180" : "rotate-0"
                    )} />
                  </button>
                  {resourcesOpen && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {resourcesNavigation.map((resource) => {
                        const IconComponent = resource.icon;
                        return (
                          <Link
                            key={resource.name}
                            href={resource.href}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3 text-sm transition-all duration-150 hover:bg-slate-50",
                              pathname === resource.href
                                ? "text-above-rose-700 bg-above-rose-50 border-r-2 border-above-rose-400 font-medium"
                                : "text-slate-700 hover:text-above-rose-700"
                            )}
                          >
                            <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium">{resource.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{resource.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium py-2 px-2 lg:px-3 rounded-md transition-colors whitespace-nowrap",
                  pathname === item.href 
                    ? "text-above-rose-700 bg-above-rose-100 font-semibold" 
                    : "text-slate-700 hover:text-above-rose-700 hover:bg-above-rose-50"
                )}
              >
                {item.name}
              </Link>
            );
          })}
          <AboveButton asChild variant="default" size="sm" className="ml-2 whitespace-nowrap">
            <Link href="/assessment">Start Assessment</Link>
          </AboveButton>
        </div>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden h-10 w-10 p-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {mobileNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-4 py-3 rounded-md text-base font-medium transition-colors",
                  pathname === item.href 
                    ? "text-above-rose-700 bg-above-rose-100 font-semibold" 
                    : "text-slate-900 hover:bg-slate-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <AboveButton asChild variant="default" size="lg" className="w-full">
                <Link href="/assessment" onClick={() => setMobileMenuOpen(false)}>
                  Start Assessment
                </Link>
              </AboveButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}