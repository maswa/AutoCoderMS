/**
 * MarkdownViewer Component
 *
 * Renders markdown content with syntax highlighting for code blocks
 * and copy-to-clipboard functionality.
 */

import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MarkdownViewerProps {
  content: string
  className?: string
}

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * CodeBlock component with syntax highlighting and copy functionality
 */
function CodeBlock({ inline, className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  // Extract language from className (format: "language-xxx")
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  const codeString = String(children).replace(/\n$/, '')

  // Detect dark mode by checking document class
  const isDarkMode = typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [codeString])

  // Inline code styling
  if (inline) {
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
        {children}
      </code>
    )
  }

  // Block code with syntax highlighting
  return (
    <div className="relative group my-4">
      {/* Language label and copy button */}
      <div className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 z-10">
        {language && (
          <span className="text-xs text-muted-foreground uppercase font-medium">
            {language}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <Check size={14} className="text-primary" />
          ) : (
            <Copy size={14} />
          )}
        </Button>
      </div>

      <SyntaxHighlighter
        style={isDarkMode ? oneDark : oneLight}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 'var(--radius)',
          fontSize: '0.875rem',
          padding: '1rem',
          paddingTop: '2.5rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono)',
          },
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  )
}

/**
 * MarkdownViewer renders markdown content with GFM support
 * and syntax-highlighted code blocks.
 */
export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        // Headings
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-h1:text-2xl prose-h1:border-b prose-h1:border-border prose-h1:pb-2 prose-h1:mb-4',
        'prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3',
        'prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2',
        // Paragraphs and text
        'prose-p:text-foreground prose-p:leading-relaxed',
        'prose-strong:text-foreground prose-strong:font-semibold',
        // Lists
        'prose-ul:my-2 prose-ol:my-2',
        'prose-li:text-foreground prose-li:my-0.5',
        // Links
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        // Code
        'prose-code:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1',
        'prose-pre:bg-transparent prose-pre:p-0',
        // Tables
        'prose-table:border prose-table:border-border',
        'prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-3 prose-th:py-2',
        'prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2',
        // Blockquotes
        'prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4',
        // Horizontal rules
        'prose-hr:border-border',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
