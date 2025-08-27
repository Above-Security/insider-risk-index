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

  // Handle body scroll lock when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="bg-above-white/95 border-b border-above-rose-200 sticky top-0 z-50 backdrop-blur-lg shadow-sm">
      <nav className="mx-auto max-w-7xl flex items-center justify-between py-2 px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex-shrink-0">
          <Link 
            href="/" 
            className="inline-flex items-center p-1.5 rounded-md min-w-0 focus:outline-none focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 hover:bg-above-rose-50 transition-colors"
            aria-label="Go to homepage"
          >
            <LogoWithText 
              logoSize="md"
              textSize="lg"
              color="above-rose"
              showFullText={true}
            />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 p-0 hover:bg-above-rose-50"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open main menu"
          >
            <Menu className="h-7 w-7" />
          </Button>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-4 xl:gap-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium leading-6 transition-all duration-200 py-2 px-2 xl:px-3 rounded-md hover:text-above-rose-700 hover:bg-above-rose-50",
                pathname === item.href 
                  ? "text-above-rose-700 bg-above-rose-100 font-semibold" 
                  : "text-slate-700"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-shrink-0 lg:justify-end">
          <AboveButton asChild variant="default" size="sm" className="h-9 px-3 text-sm font-medium whitespace-nowrap">
            <Link href="/assessment">
              <span className="hidden xl:inline">Start Assessment</span>
              <span className="xl:hidden">Start</span>
            </Link>
          </AboveButton>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-[61] w-full max-w-sm overflow-y-auto bg-white px-6 py-6 shadow-2xl transform transition-transform duration-300 ease-out border-l border-slate-200">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="inline-flex items-center p-1.5 rounded-md min-w-0 flex-1 focus:outline-none focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2 hover:bg-above-rose-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Go to homepage"
              >
                <LogoWithText 
                  logoSize="md"
                  textSize="xl"
                  color="above-rose"
                  showFullText={false}
                />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 hover:bg-above-rose-50"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-7 w-7" />
              </Button>
            </div>
            
            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-slate-200">
                <div className="space-y-1 py-6">
                  {mobileNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "-mx-3 block rounded-lg px-4 py-3 text-base font-medium leading-7 transition-all duration-200",
                        "hover:bg-slate-50 focus:bg-slate-50",
                        "focus:outline-none focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2",
                        "active:bg-slate-100",
                        pathname === item.href 
                          ? "text-above-rose-700 bg-above-rose-50 font-semibold" 
                          : "text-slate-900"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="py-6">
                  <AboveButton asChild variant="default" size="lg" className="w-full h-12 text-base font-medium">
                    <Link href="/assessment" onClick={() => setMobileMenuOpen(false)}>
                      Start Assessment
                    </Link>
                  </AboveButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}