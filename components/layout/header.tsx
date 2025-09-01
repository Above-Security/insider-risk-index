"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboveButton } from "@/components/ui/above-components";
import { LogoWithText } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { LAYOUT_CONSTANTS } from "@/lib/layout-utils";

const navigation = [
  { name: "Assessment", href: "/assessment" },
  { name: "Benchmarks", href: "/benchmarks" },
  { name: "Matrix", href: "/matrix" },
  { name: "Playbooks", href: "/playbooks" },
  { name: "Research", href: "/research" },
  { name: "Glossary", href: "/glossary" },
  { name: "About", href: "/about" },
];

const mobileNavigation = [
  { name: "Assessment", href: "/assessment" },
  { name: "Benchmarks", href: "/benchmarks" },
  { name: "Matrix", href: "/matrix" },
  { name: "Playbooks", href: "/playbooks" },
  { name: "Research", href: "/research" },
  { name: "Glossary", href: "/glossary" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
        <div className="hidden lg:flex lg:items-center lg:gap-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium py-2 px-3 rounded-md transition-colors",
                pathname === item.href 
                  ? "text-above-rose-700 bg-above-rose-100 font-semibold" 
                  : "text-slate-700 hover:text-above-rose-700 hover:bg-above-rose-50"
              )}
            >
              {item.name}
            </Link>
          ))}
          <AboveButton asChild variant="default" size="sm">
            <Link href="/assessment">Start Assessment</Link>
          </AboveButton>
        </div>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden h-10 w-10 p-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-lg">
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