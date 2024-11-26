'use client';

import { useState } from 'react';
import { convertToMarkdown } from '@/lib/converter';
import MarkdownPreview from '@/components/MarkdownPreview';
import { Bot, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [input, setInput] = useState('');
  const [markdown, setMarkdown] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    try {
      const parsedJson = JSON.parse(value);
      const markdownResult = convertToMarkdown(parsedJson);
      setMarkdown(markdownResult);
    } catch (error) {
      setMarkdown('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6 text-slate-600" strokeWidth={1.5} />
            <h1 className="text-lg font-medium text-slate-900">
              Claude JSON Converter
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <UserCircle2 className="h-6 w-6 text-slate-400" />
              <div>
                <h2 className="text-base font-medium text-slate-900">Quick Start</h2>
                <div className="mt-2 prose-sm text-slate-500">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Open Claude in your browser and start DevTools (F12)</li>
                    <li>Go to the Network tab and filter by <code>chat_conversations/</code></li>
                    <li>Right-click the matching request and select "Copy response"</li>
                    <li>Paste the JSON in the input below</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8">
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">JSON Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="json-input"
                  value={input}
                  onChange={handleInputChange}
                  className="font-mono min-h-[200px] resize-y"
                  placeholder="Paste your Claude JSON here..."
                />
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">Markdown Preview</CardTitle>
                {markdown && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(markdown)}
                  >
                    Copy Markdown
                  </Button>
                )}
              </CardHeader>
              <CardContent className="max-h-[800px] overflow-auto">
                <MarkdownPreview markdown={markdown} />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="mt-auto py-6 border-t">
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Built with Next.js and Tailwind CSS. 
            <a 
              href="https://github.com/yourusername/claude-json-converter" 
              className="ml-1 text-slate-600 hover:text-slate-500"
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
} 