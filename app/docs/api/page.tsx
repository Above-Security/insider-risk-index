"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPageLayout, getSectionLayout } from "@/lib/layout-utils";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ApiDocumentationPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  
  const baseUrl = "https://insiderisk.io";
  
  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/glossary",
      description: "Retrieve all glossary terms",
      response: `{
  "terms": [
    {
      "id": "string",
      "term": "string",
      "slug": "string",
      "definition": "string",
      "category": "string",
      "difficulty": "string",
      "pillarRelevance": ["string"],
      "relatedTerms": ["string"]
    }
  ]
}`,
    },
    {
      method: "GET",
      path: "/api/glossary/[slug]",
      description: "Get a specific glossary term by slug",
      params: [
        { name: "slug", type: "string", description: "URL-friendly term identifier" }
      ],
      response: `{
  "term": {
    "id": "string",
    "term": "string",
    "slug": "string",
    "definition": "string",
    "category": "string",
    "difficulty": "string",
    "pillarRelevance": ["string"],
    "relatedTerms": ["string"],
    "sources": ["string"]
  }
}`,
    },
    {
      method: "GET",
      path: "/api/matrix",
      description: "Fetch Insider Threat Matrix data",
      response: `{
  "techniques": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "motive | coercion | manipulation",
      "preventions": [...],
      "detections": [...],
      "pillarMapping": {...}
    }
  ],
  "lastUpdated": "ISO 8601 timestamp"
}`,
    },
    {
      method: "POST",
      path: "/api/matrix/sync",
      description: "Synchronize Matrix data from ForScie repository",
      auth: "Required (Admin)",
      response: `{
  "success": true,
  "message": "Matrix data synchronized",
  "techniques": 50,
  "timestamp": "ISO 8601 timestamp"
}`,
    },
    {
      method: "GET",
      path: "/api/matrix/techniques",
      description: "Search and filter Matrix techniques",
      queryParams: [
        { name: "category", type: "string", description: "Filter by category (motive/coercion/manipulation)" },
        { name: "pillar", type: "string", description: "Filter by pillar relevance" },
        { name: "search", type: "string", description: "Search term for title/description" }
      ],
      response: `{
  "techniques": [...],
  "total": 50,
  "filtered": 12
}`,
    },
    {
      method: "GET",
      path: "/api/matrix/analysis/[pillar]",
      description: "Get pillar-specific Matrix analysis",
      params: [
        { name: "pillar", type: "string", description: "Pillar ID (visibility/coaching/evidence/identity/phishing)" }
      ],
      response: `{
  "pillar": "string",
  "techniques": [...],
  "recommendations": [...],
  "statistics": {
    "totalTechniques": 15,
    "byCategory": {...}
  }
}`,
    },
    {
      method: "GET",
      path: "/api/pdf/[id]",
      description: "Generate and download comprehensive PDF report",
      params: [
        { name: "id", type: "string", description: "Assessment ID from database" }
      ],
      response: `Binary PDF data (application/pdf)`,
    },
    {
      method: "GET",
      path: "/api/og",
      description: "Generate Open Graph images",
      queryParams: [
        { name: "title", type: "string", description: "Page title" },
        { name: "description", type: "string", description: "Page description" },
        { name: "score", type: "number", description: "Risk score (0-100)" }
      ],
      response: `Binary PNG image (image/png)`,
    },
    {
      method: "GET",
      path: "/api/sitemap",
      description: "Generate XML sitemap",
      response: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://insiderisk.io/</loc>
    <lastmod>2025-01-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>`,
    },
    {
      method: "GET",
      path: "/api/rss",
      description: "RSS feed for research articles",
      response: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Insider Risk Index Research</title>
    <link>https://insiderisk.io/research</link>
    <description>Latest research and insights</description>
    <item>...</item>
  </channel>
</rss>`,
    },
    {
      method: "POST",
      path: "/api/contact",
      description: "Submit contact form",
      body: `{
  "name": "string",
  "email": "string",
  "organization": "string (optional)",
  "message": "string",
  "type": "general | support | partnership"
}`,
      response: `{
  "success": true,
  "message": "Thank you for contacting us"
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-above-gradient-light">
      <div className={`${getPageLayout()} ${getSectionLayout('lg')}`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Developer documentation for integrating with Insider Risk Index APIs
          </p>

          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="bg-slate-100 px-3 py-1 rounded text-sm">{baseUrl}</code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Response Format</h3>
                  <p className="text-slate-700">All API responses are in JSON format unless otherwise specified.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rate Limiting</h3>
                  <p className="text-slate-700">
                    Public endpoints: 60 requests per minute<br />
                    Authenticated endpoints: 120 requests per minute
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-slate-700">
                    Most endpoints are public. Admin endpoints require API key authentication via 
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-sm mx-1">X-API-Key</code> header.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Endpoints</h2>
            
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          endpoint.method === "GET" ? "default" : 
                          endpoint.method === "POST" ? "secondary" : 
                          "outline"
                        }
                        className="font-mono"
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                      {endpoint.auth && (
                        <Badge variant="destructive" className="text-xs">
                          {endpoint.auth}
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${baseUrl}${endpoint.path}`, endpoint.path)}
                      className="text-slate-500 hover:text-slate-700 transition-colors"
                      title="Copy endpoint URL"
                    >
                      {copiedEndpoint === endpoint.path ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{endpoint.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Parameters */}
                  {endpoint.params && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Path Parameters</h4>
                      <div className="bg-slate-50 rounded p-3 space-y-2">
                        {endpoint.params.map((param, i) => (
                          <div key={i} className="text-sm">
                            <code className="font-mono text-above-rose-700">{param.name}</code>
                            <span className="text-slate-500 ml-2">({param.type})</span>
                            <span className="text-slate-600 ml-2">- {param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Query Parameters */}
                  {endpoint.queryParams && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Query Parameters</h4>
                      <div className="bg-slate-50 rounded p-3 space-y-2">
                        {endpoint.queryParams.map((param, i) => (
                          <div key={i} className="text-sm">
                            <code className="font-mono text-above-rose-700">{param.name}</code>
                            <span className="text-slate-500 ml-2">({param.type})</span>
                            <span className="text-slate-600 ml-2">- {param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {endpoint.body && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Request Body</h4>
                      <pre className="bg-slate-900 text-slate-100 rounded p-3 text-xs overflow-x-auto">
                        <code>{endpoint.body}</code>
                      </pre>
                    </div>
                  )}

                  {/* Response */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Response</h4>
                    <pre className="bg-slate-900 text-slate-100 rounded p-3 text-xs overflow-x-auto">
                      <code>{endpoint.response}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Error Codes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Error Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">400</Badge>
                  <span className="text-slate-700">Bad Request - Invalid parameters</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">401</Badge>
                  <span className="text-slate-700">Unauthorized - Missing or invalid API key</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">404</Badge>
                  <span className="text-slate-700">Not Found - Resource doesn't exist</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">429</Badge>
                  <span className="text-slate-700">Too Many Requests - Rate limit exceeded</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">500</Badge>
                  <span className="text-slate-700">Internal Server Error</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Example Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Fetch Glossary Terms (JavaScript)</h4>
                <pre className="bg-slate-900 text-slate-100 rounded p-3 text-xs overflow-x-auto">
                  <code>{`fetch('https://insiderisk.io/api/glossary')
  .then(response => response.json())
  .then(data => {
    console.log(\`Found \${data.terms.length} glossary terms\`);
    data.terms.forEach(term => {
      console.log(\`- \${term.term}: \${term.definition.substring(0, 50)}...\`);
    });
  })
  .catch(error => console.error('Error:', error));`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Generate PDF Report (Python)</h4>
                <pre className="bg-slate-900 text-slate-100 rounded p-3 text-xs overflow-x-auto">
                  <code>{`import requests

# Generate a comprehensive PDF using simplified endpoint
assessment_id = "clx123abc456def"  # Must be from database
response = requests.get(
    f'https://insiderisk.io/api/pdf/{assessment_id}'
)

if response.status_code == 200:
    with open('insider_risk_comprehensive.pdf', 'wb') as f:
        f.write(response.content)
    print('Comprehensive PDF saved successfully')
elif response.status_code == 410:
    print('Error: Using deprecated PDF endpoint. Use /api/pdf/[id] instead.')
else:
    print(f'Error: {response.status_code}')`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Search Matrix Techniques (cURL)</h4>
                <pre className="bg-slate-900 text-slate-100 rounded p-3 text-xs overflow-x-auto">
                  <code>{`curl -X GET "https://insiderisk.io/api/matrix/techniques?category=manipulation&pillar=phishing" \\
  -H "Accept: application/json"`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mt-8 mb-12">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                For API support, feature requests, or to report issues:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• Email: <a href="mailto:api@insiderisk.io" className="text-above-rose-700 hover:underline">api@insiderisk.io</a></li>
                <li>• GitHub Issues: <a href="https://github.com/insiderisk/api" target="_blank" rel="noopener noreferrer" className="text-above-rose-700 hover:underline">Report an issue</a></li>
                <li>• Contact Form: <Link href="/contact" className="text-above-rose-700 hover:underline">Send us a message</Link></li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center mb-8">
            <Link 
              href="/"
              className="text-above-rose-700 hover:text-above-rose-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}