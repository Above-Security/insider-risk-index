import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatScore(score: number): string {
  return `${Math.round(score * 100) / 100}`;
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function generateId(prefix = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      resolve();
    } catch (error) {
      document.body.removeChild(textArea);
      reject(error);
    }
  });
}

export function downloadFile(data: Blob | string, filename: string, mimeType?: string): void {
  const blob = typeof data === "string" 
    ? new Blob([data], { type: mimeType || "text/plain" })
    : data;
    
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function getColorFromScore(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (score >= 81) {
    return {
      bg: "bg-above-blue-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    };
  } else if (score >= 61) {
    return {
      bg: "bg-above-blue-50",
      text: "text-above-blue-800", 
      border: "border-above-blue-200",
    };
  } else if (score >= 41) {
    return {
      bg: "bg-above-peach-50",
      text: "text-above-peach-800",
      border: "border-above-peach-200",
    };
  } else if (score >= 21) {
    return {
      bg: "bg-above-peach-50",
      text: "text-above-peach-800",
      border: "border-above-peach-200",
    };
  } else {
    return {
      bg: "bg-above-rose-50",
      text: "text-above-rose-800",
      border: "border-above-rose-200",
    };
  }
}

export function getScoreLabel(score: number): string {
  if (score >= 81) return "Excellent";
  if (score >= 61) return "Good";
  if (score >= 41) return "Fair";
  if (score >= 21) return "Poor";
  return "Critical";
}

export function getRiskLevel(score: number): {
  level: number;
  name: string;
  description: string;
  color: string;
} {
  if (score >= 85) {
    return {
      level: 5,
      name: "Optimized",
      description: "Minimal Risk - Excellent insider risk program",
      color: "#68ADFF" // above-blue-900 - excellent performance
    };
  } else if (score >= 65) {
    return {
      level: 4,
      name: "Proactive",
      description: "Low Risk - Good baseline security",
      color: "#B0D5FF" // above-blue-500 - good performance
    };
  } else if (score >= 45) {
    return {
      level: 3,
      name: "Managed",
      description: "Moderate Risk - Some gaps identified",
      color: "#FFAB8D" // above-peach-600 - moderate performance
    };
  } else if (score >= 25) {
    return {
      level: 2,
      name: "Emerging",
      description: "High Risk - Major improvements needed",
      color: "#FF8D67" // above-peach-800 - poor performance
    };
  } else {
    return {
      level: 1,
      name: "Ad Hoc",
      description: "Critical Risk - Immediate action required",
      color: "#FF738C" // above-rose-800 - critical performance
    };
  }
}

export function parseQueryString(query: string): Record<string, string> {
  const params = new URLSearchParams(query);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}

export function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    csv: "text/csv",
    json: "application/json",
    xml: "application/xml",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    zip: "application/zip",
  };
  
  return mimeTypes[ext || ""] || "application/octet-stream";
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function removeUndefined<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  
  return cleaned as T;
}