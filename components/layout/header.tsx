"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboveButton } from "@/components/ui/above-components";
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
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-above-white border-b border-above-rose-100/30 sticky top-0 z-50 backdrop-blur-sm">
      <nav className={`mx-auto flex ${LAYOUT_CONSTANTS.container.xl} items-center justify-between ${LAYOUT_CONSTANTS.spacing.responsive.md}`} aria-label="Global">
        <div className="flex lg:flex-1 min-w-0">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 min-w-0">
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-above-rose-700 flex-shrink-0" />
            <span className="font-bold text-lg sm:text-xl text-slate-900 truncate">
              <span className="hidden sm:inline">Insider Risk Index</span>
              <span className="sm:hidden">IRI</span>
            </span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open main menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 transition-colors hover:text-above-rose-700",
                pathname === item.href 
                  ? "text-above-rose-700 border-b-2 border-above-rose-700" 
                  : "text-slate-700"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <AboveButton asChild variant="default">
            <Link href="/assessment">
              Start Assessment
            </Link>
          </AboveButton>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 z-50 bg-above-blue-800/75 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-above-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-above-rose-100/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="-m-1.5 p-1.5 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-8 w-8 text-above-rose-700" />
                <span className="font-bold text-xl text-slate-900">Insider Risk Index</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-above-rose-100/30">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "-mx-3 block rounded-lg px-4 py-3 text-base font-medium leading-6 transition-all duration-200",
                        "hover:bg-above-rose-50 focus:bg-above-rose-50",
                        "focus:outline-none focus:ring-2 focus:ring-above-rose-500 focus:ring-offset-2",
                        pathname === item.href 
                          ? "text-above-rose-700 bg-above-rose-100" 
                          : "text-slate-800"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="py-6 border-t border-above-rose-100/30">
                  <AboveButton asChild variant="default" className="w-full h-12 text-base font-medium">
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