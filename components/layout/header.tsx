"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  return (
    <header className="bg-above-white/95 border-b border-above-rose-200 sticky top-0 z-50 backdrop-blur-lg shadow-sm">
      <nav className="mx-auto max-w-7xl flex items-center justify-between py-2 px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex-shrink-0">
          <Link href="/" className="-m-1.5 p-1.5 min-w-0">
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
                className="-m-1.5 p-1.5 min-w-0 flex-1"
                onClick={() => setMobileMenuOpen(false)}
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
              <div className="-my-6 divide-y divide-above-rose-100/30">
                <div className="space-y-2 py-6">
                  {mobileNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "-mx-3 block rounded-lg px-4 py-4 text-lg font-medium leading-6 transition-all duration-200",
                        "hover:bg-above-rose-50 focus:bg-above-rose-50",
                        "focus:outline-none focus:ring-2 focus:ring-above-rose-700 focus:ring-offset-2",
                        "active:bg-above-rose-100",
                        pathname === item.href 
                          ? "text-above-rose-700 bg-above-rose-100 font-semibold" 
                          : "text-slate-800"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="py-6 border-t border-above-rose-100/30">
                  <AboveButton asChild variant="default" size="lg" className="w-full h-14 text-lg font-medium">
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