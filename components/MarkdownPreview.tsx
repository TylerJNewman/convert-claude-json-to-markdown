'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Components } from 'react-markdown';
import CopyButton from './CopyButton';
import MessageHeader from './MessageHeader';

interface MarkdownPreviewProps {
  markdown: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const components: Components = {
  code: function Code({ inline, className, children }: CodeProps) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');
    
    return !inline ? (
      <div className="relative">
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
        >
          {codeString}
        </SyntaxHighlighter>
        <CopyButton text={codeString} />
      </div>
    ) : (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  },
  strong: function Strong({ children }) {
    // Check if this is a message header
    if (typeof children === 'string' && 
        (children.toLowerCase() === 'human' || children.toLowerCase() === 'assistant') && 
        children.includes('(')) {
      const isHuman = children.toLowerCase() === 'human';
      const timestamp = children.match(/\((.*?)\)/)?.[1] || '';
      return <MessageHeader isHuman={isHuman} timestamp={timestamp} />;
    }
    return <strong>{children}</strong>;
  },
  p: function Paragraph({ children }) {
    // Initialize textContent as an empty string
    let textContent = '';

    // Check if children is an array or a single element
    if (Array.isArray(children)) {
      textContent = children.map(child => {
        if (typeof child === 'object' && child.props && child.props.children) {
          return child.props.children; // Access the text from the child
        }
        return child?.toString() || ''; // Convert child to string safely
      }).join('');
    } else if (children && typeof children === 'object' && 'props' in children && children.props?.children) {
      textContent = children.props.children.toString(); // Handle single child safely
    } else {
      textContent = String(children || ''); // Handle string or other types safely
    }

    // Check if this paragraph contains a message header
    if (textContent.includes('(') && (textContent.includes('human') || textContent.includes('assistant'))) {
      const isHuman = textContent.includes('human');
      const timestamp = textContent.match(/\((.*?)\)/)?.[1] || '';
      return <MessageHeader isHuman={isHuman} timestamp={timestamp} />;
    }
    return <p>{children}</p>;
  }
};

export default function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  if (!markdown) {
    return (
      <div className="h-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
        <p>Markdown preview will appear here...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto border border-gray-300 rounded-md bg-white">
      <div className="markdown-preview p-3">
        <ReactMarkdown 
          components={components}
          children={markdown}
          remarkPlugins={[]}
          rehypePlugins={[]}
        />
      </div>
    </div>
  );
} 