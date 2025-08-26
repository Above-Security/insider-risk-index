import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "default" | "white" | "above-rose" | "above-blue";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10", 
  lg: "h-12 w-12",
  xl: "h-14 w-14"
};

export function Logo({ 
  className, 
  size = "md", 
  color = "default" 
}: LogoProps) {
  return (
    <div 
      className={cn(
        sizeClasses[size], 
        "relative flex-shrink-0",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="Insider Risk Index Logo"
        fill
        className="object-contain"
        sizes={`(max-width: 768px) ${size === "sm" ? "32px" : size === "md" ? "40px" : size === "lg" ? "48px" : "56px"}, ${size === "sm" ? "32px" : size === "md" ? "40px" : size === "lg" ? "48px" : "56px"}`}
      />
    </div>
  );
}

export function LogoWithText({ 
  className,
  logoSize = "md",
  textSize = "xl",
  color = "default",
  showFullText = true 
}: {
  className?: string;
  logoSize?: "sm" | "md" | "lg" | "xl";
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl";
  color?: "default" | "white" | "above-rose" | "above-blue";
  showFullText?: boolean;
}) {
  const textColorClasses = {
    default: "text-slate-900",
    white: "text-white",
    "above-rose": "text-above-rose-700", 
    "above-blue": "text-above-blue-800"
  };

  const textSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl"
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Logo size={logoSize} color={color} className="flex-shrink-0" />
      <span className={cn(
        "font-bold leading-none whitespace-nowrap",
        textColorClasses[color],
        textSizeClasses[textSize]
      )}>
        {showFullText ? (
          <>
            <span className="hidden md:inline">Insider Risk Index</span>
            <span className="hidden sm:inline md:hidden">Risk Index</span>
            <span className="sm:hidden">IRI</span>
          </>
        ) : (
          "IRI"
        )}
      </span>
    </div>
  );
}