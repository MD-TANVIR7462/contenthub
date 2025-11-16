import { Button } from '@/components/ui/button';
import { Download, Copy, Eye, X } from 'lucide-react';

interface EditorPreviewProps {
  content: string;
  onClose: () => void;
  onCopy: () => void;
  onExport: (format: 'html' | 'txt' | 'md') => void;
}

export function EditorPreview({ content, onClose, onCopy, onExport }: EditorPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('html')}
              className="border-gray-300 hover:bg-gray-50 gap-1"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">HTML</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('md')}
              className="border-gray-300 hover:bg-gray-50 gap-1"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">MD</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('txt')}
              className="border-gray-300 hover:bg-gray-50 gap-1"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">TXT</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCopy}
              className="border-gray-300 hover:bg-gray-50 gap-1"
            >
              <Copy className="w-4 h-4" />
              <span className="text-xs">Copy</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          className="w-full max-h-96 overflow-auto bg-white text-gray-900 p-6 rounded-lg border border-gray-200"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              .preview-content h1 {
                font-size: 2em;
                font-weight: bold;
                margin: 0.67em 0;
                line-height: 1.2;
              }
              .preview-content h2 {
                font-size: 1.5em;
                font-weight: bold;
                margin: 0.75em 0;
                line-height: 1.3;
              }
              .preview-content h3 {
                font-size: 1.17em;
                font-weight: bold;
                margin: 0.83em 0;
                line-height: 1.4;
              }
              .preview-content p {
                margin: 1em 0;
                line-height: 1.6;
              }
              .preview-content strong {
                font-weight: bold;
              }
              .preview-content em {
                font-style: italic;
              }
              .preview-content u {
                text-decoration: underline;
              }
              .preview-content del {
                text-decoration: line-through;
              }
              .preview-content ul {
                list-style-type: disc;
                margin: 1em 0;
                padding-left: 2.5em;
              }
              .preview-content ol {
                list-style-type: decimal;
                margin: 1em 0;
                padding-left: 2.5em;
              }
              .preview-content li {
                margin: 0.5em 0;
                line-height: 1.6;
              }
              .preview-content blockquote {
                border-left: 4px solid #d1d5db;
                padding-left: 1em;
                margin: 1em 0;
                color: #6b7280;
                font-style: italic;
              }
              .preview-content code {
                background-color: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 0.25em;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
              }
              .preview-content pre {
                background-color: #1f2937;
                color: #f9fafb;
                padding: 1em;
                border-radius: 0.5em;
                overflow-x: auto;
                margin: 1em 0;
              }
              .preview-content pre code {
                background-color: transparent;
                padding: 0;
                color: inherit;
              }
              .preview-content table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                border: 1px solid #d1d5db;
              }
              .preview-content th {
                background-color: #f3f4f6;
                font-weight: bold;
                padding: 0.75em;
                border: 1px solid #d1d5db;
                text-align: left;
              }
              .preview-content td {
                padding: 0.75em;
                border: 1px solid #d1d5db;
              }
              .preview-content a {
                color: #3b82f6;
                text-decoration: underline;
              }
              .preview-content a:hover {
                color: #2563eb;
              }
              .preview-content hr {
                border: none;
                border-top: 2px solid #d1d5db;
                margin: 2em 0;
              }
              .preview-content img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5em;
                margin: 1em 0;
              }
              .preview-content sub {
                font-size: 0.75em;
                vertical-align: sub;
              }
              .preview-content sup {
                font-size: 0.75em;
                vertical-align: super;
              }
            `
          }} />
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">HTML Code</h4>
        <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto border border-gray-200 max-h-64">
          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap wrap-break-word">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}
