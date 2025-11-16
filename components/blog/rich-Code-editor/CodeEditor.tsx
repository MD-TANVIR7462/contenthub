import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  wordWrap: boolean;
}

export function CodeEditor({ value, onChange, onFocus, onBlur, wordWrap }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = syntaxHighlight(value);
    }
  }, [value]);

  const syntaxHighlight = (code: string): string => {
    const htmlTags = /(&lt;\/?)(\w+)(.*?)(&gt;)/g;
    const htmlAttributes = /(\w+)=["']([^"']*)["']/g;
    const cssStyles = /style=["']([^"']*)["']/g;

    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    highlighted = highlighted.replace(
      htmlTags,
      (match, p1, p2, p3, p4) => {
        let attrs = p3;

        attrs = attrs.replace(
          cssStyles,
          (m: string, styles: string) => {
            return `style=<span class="syntax-string">"${styles}"</span>`;
          }
        );

        attrs = attrs.replace(
          htmlAttributes,
          (m: string, name: string, val: string) => {
            return `<span class="syntax-attr">${name}</span>=<span class="syntax-string">"${val}"</span>`;
          }
        );

        return `<span class="syntax-tag">${p1}</span><span class="syntax-tag-name">${p2}</span>${attrs}<span class="syntax-tag">${p4}</span>`;
      }
    );

    return highlighted;
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="relative w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
          .syntax-tag {
            color: #6b7280;
          }
          .syntax-tag-name {
            color: #dc2626;
            font-weight: 600;
          }
          .syntax-attr {
            color: #2563eb;
          }
          .syntax-string {
            color: #059669;
          }
          .code-editor-container {
            position: relative;
            width: 100%;
          }
          .code-highlight {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 16px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            overflow: auto;
            pointer-events: none;
            white-space: ${wordWrap ? 'pre-wrap' : 'pre'};
            word-wrap: ${wordWrap ? 'break-word' : 'normal'};
            color: transparent;
            background: transparent;
          }
          .code-textarea {
            position: relative;
            width: 100%;
            padding: 16px;
            min-height: 384px;
            resize: none;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            background: transparent;
            color: #1f2937;
            caret-color: #1f2937;
            white-space: ${wordWrap ? 'pre-wrap' : 'pre'};
            word-wrap: ${wordWrap ? 'break-word' : 'normal'};
            z-index: 1;
          }
          .code-textarea::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          .code-textarea::-webkit-scrollbar-track {
            background: #f3f4f6;
          }
          .code-textarea::-webkit-scrollbar-thumb {
            background: #9ca3af;
            border-radius: 5px;
          }
          .code-textarea::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `
      }} />

      <div className="code-editor-container">
        <div
          ref={highlightRef}
          className="code-highlight"
          aria-hidden="true"
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onScroll={handleScroll}
          placeholder="Start typing your HTML content here..."
          className="code-textarea focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
