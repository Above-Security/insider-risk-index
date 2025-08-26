import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb,
  Target,
  Clock,
  Users,
  Shield,
  Eye,
  Search,
  Key,
  ShieldAlert
} from 'lucide-react';

// MDX Components
const components = {
  // Basic HTML elements with styling
  h1: (props: any) => <h1 className="text-3xl font-bold mb-6 text-slate-900" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 border-b-2 border-above-rose-200 pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mb-3 mt-6 text-slate-900" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-medium mb-2 mt-4 text-slate-900" {...props} />,
  p: (props: any) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-1 text-slate-700" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-700" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-above-rose-700 pl-4 italic my-4 text-slate-700 bg-above-rose-50 py-3 rounded-r-lg shadow-sm" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-above-blue-100 text-slate-900 px-2 py-1 rounded font-mono text-sm border border-above-blue-200" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-slate-800 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm border border-slate-600 shadow-lg" {...props} />
  ),
  a: (props: any) => (
    <a className="text-above-rose-700 hover:text-above-rose-900 underline underline-offset-2 font-medium" {...props} />
  ),
  
  // Enhanced table styling for research data
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse bg-white rounded-lg shadow-lg border border-slate-300" {...props} />
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-slate-100" {...props} />
  ),
  tbody: (props: any) => (
    <tbody className="bg-white" {...props} />
  ),
  tr: (props: any) => (
    <tr className="hover:bg-slate-50 transition-colors" {...props} />
  ),
  th: (props: any) => (
    <th className="bg-slate-100 text-slate-900 font-semibold p-4 text-left border border-slate-300 text-sm uppercase tracking-wide first:rounded-tl-lg last:rounded-tr-lg" {...props} />
  ),
  td: (props: any) => (
    <td className="p-4 border border-slate-300 text-slate-700 text-sm" {...props} />
  ),
  
  // Custom components
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Alert,
  AlertDescription,
  
  // Icons
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Target,
  Clock,
  Users,
  Shield,
  Eye,
  Search,
  Key,
  ShieldAlert,
  
  // Custom playbook components
  PlaybookSection: ({ title, children, level = 2, icon: Icon }: { 
    title: string; 
    children: React.ReactNode; 
    level?: number;
    icon?: any;
  }) => {
    const HeadingComponent = level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
    return (
      <div className="mb-8">
        <HeadingComponent className={`
          ${level === 2 ? 'text-2xl' : level === 3 ? 'text-xl' : 'text-lg'}
          font-semibold mb-4 text-slate-900 flex items-center gap-2
        `}>
          {Icon && <Icon className="h-5 w-5 text-above-blue-800" />}
          {title}
        </HeadingComponent>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  },
  
  InfoBox: ({ type = "info", title, children }: {
    type?: "info" | "warning" | "success" | "tip";
    title?: string;
    children: React.ReactNode;
  }) => {
    const configs = {
      info: { icon: Info, bg: "bg-above-blue-50", border: "border-above-blue-200", text: "text-above-blue-800" },
      warning: { icon: AlertTriangle, bg: "bg-above-peach-50", border: "border-above-peach-200", text: "text-above-peach-800" },
      success: { icon: CheckCircle, bg: "bg-above-blue-50", border: "border-above-blue-200", text: "text-above-blue-800" },
      tip: { icon: Lightbulb, bg: "bg-above-lavender-50", border: "border-above-lavender-200", text: "text-above-lavender-800" }
    };
    
    const config = configs[type];
    const IconComponent = config.icon;
    
    return (
      <div className={`${config.bg} ${config.border} border rounded-lg p-4 my-4`}>
        <div className="flex items-start gap-3">
          <IconComponent className={`h-5 w-5 ${config.text} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            {title && <h4 className={`font-semibold ${config.text} mb-2`}>{title}</h4>}
            <div className={config.text}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  },
  
  TimelineStep: ({ step, title, duration, children }: {
    step: number;
    title: string;
    duration?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-above-blue-800 text-white rounded-full flex items-center justify-center font-semibold text-sm">
          {step}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-slate-900">{title}</h4>
          {duration && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {duration}
            </Badge>
          )}
        </div>
        <div className="text-slate-700">
          {children}
        </div>
      </div>
    </div>
  ),
  
  // Research-specific components
  StatCard: ({ title, value, subtitle, trend }: {
    title: string;
    value: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => {
    const trendColors = {
      up: 'text-above-rose-700',
      down: 'text-above-blue-700', 
      neutral: 'text-slate-600'
    };
    
    return (
      <div className="bg-white p-6 rounded-lg border-l-4 border-above-blue-700 shadow-sm">
        <h4 className="text-sm font-medium text-slate-600 mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        {subtitle && (
          <p className={`text-sm ${trend ? trendColors[trend] : 'text-slate-600'}`}>
            {subtitle}
          </p>
        )}
      </div>
    );
  },
  
  ResearchSection: ({ title, children, category }: {
    title: string;
    children: React.ReactNode;
    category?: 'findings' | 'methodology' | 'analysis' | 'recommendations';
  }) => {
    const categoryColors = {
      findings: { bg: 'bg-above-rose-50', border: 'border-above-rose-200', text: 'text-above-rose-700' },
      methodology: { bg: 'bg-above-blue-50', border: 'border-above-blue-200', text: 'text-above-blue-700' },
      analysis: { bg: 'bg-above-peach-50', border: 'border-above-peach-200', text: 'text-above-peach-700' },
      recommendations: { bg: 'bg-above-lavender-50', border: 'border-above-lavender-200', text: 'text-above-lavender-700' }
    };
    
    const colors = category ? categoryColors[category] : { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' };
    
    return (
      <div className={`${colors.bg} ${colors.border} border-l-4 p-6 my-6 rounded-r-lg`}>
        <h3 className={`text-xl font-semibold mb-4 ${colors.text}`}>{title}</h3>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  }
};

interface MDXContentProps {
  content: string;
  className?: string;
}

export function MDXContent({ content, className = "" }: MDXContentProps) {
  return (
    <div className={className}>
      <MDXRemote 
        source={content} 
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}