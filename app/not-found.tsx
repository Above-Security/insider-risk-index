import Link from 'next/link';
import { FileQuestion, Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto p-4 bg-above-blue-100 rounded-full w-fit">
            <FileQuestion className="h-12 w-12 text-slate-600" />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              Here are some helpful links to get you back on track:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/">
              <Button variant="default" className="w-full flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Search className="h-4 w-4" />
                Start Assessment
              </Button>
            </Link>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Popular Pages:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <Link href="/assessment" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Insider Risk Assessment
              </Link>
              <Link href="/benchmarks" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Industry Benchmarks
              </Link>
              <Link href="/glossary" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Security Glossary
              </Link>
              <Link href="/playbooks" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Implementation Playbooks
              </Link>
              <Link href="/matrix" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Threat Matrix
              </Link>
              <Link href="/about" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                About Us
              </Link>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Error Code: 404 | If you believe this is a mistake,{' '}
              <Link href="/contact" className="text-primary underline">
                contact support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}