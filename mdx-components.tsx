import type { MDXComponents } from "mdx/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components for MDX content
    Card,
    CardContent, 
    CardHeader,
    CardTitle,
    Alert,
    Badge,
    Separator,
    
    // Enhanced HTML elements
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="ml-4">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-sm font-mono text-gray-800 dark:text-gray-200">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-6 text-sm">
        {children}
      </pre>
    ),
    a: ({ href, children }) => (
      <a 
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 dark:border-gray-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
        {children}
      </td>
    ),
    hr: () => (
      <Separator className="my-8" />
    ),
    
    // Allow any other components to pass through
    ...components,
  };
}