"use client";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Simple markdown-to-HTML converter for basic formatting
  const convertMarkdownToHtml = (markdown: string) => {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li>[\s\S]*<\/li>)/g, (match) => {
      if (match.includes('<li>')) {
        return '<ul>' + match + '</ul>';
      }
      return match;
    });
    
    // Line breaks and paragraphs
    const lines = html.split('\n');
    let result = '';
    let inList = false;
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          result += '<pre><code>';
        } else {
          result += '</code></pre>\n';
        }
        continue;
      }
      
      if (inCodeBlock) {
        result += line + '\n';
        continue;
      }
      
      if (trimmedLine === '') {
        if (!inList) {
          result += '</p>\n<p>';
        }
        continue;
      }
      
      if (trimmedLine.startsWith('<h') || trimmedLine.startsWith('<ul>') || trimmedLine.startsWith('<ol>')) {
        if (!inList) {
          result += trimmedLine + '\n';
        }
      } else {
        result += line + '\n';
      }
    }
    
    // Wrap in paragraph tags and clean up
    result = '<p>' + result + '</p>';
    result = result.replace(/<p><\/p>/g, '');
    result = result.replace(/<p>(<h[1-6]>)/g, '$1');
    result = result.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    result = result.replace(/<p>(<ul>)/g, '$1');
    result = result.replace(/(<\/ul>)<\/p>/g, '$1');
    result = result.replace(/<p>(<ol>)/g, '$1');
    result = result.replace(/(<\/ol>)<\/p>/g, '$1');
    
    return result;
  };

  const htmlContent = convertMarkdownToHtml(content);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}