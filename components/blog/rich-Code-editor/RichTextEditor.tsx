import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import {
  Trash2,
  Eye,
  AlertCircle,
  Check,
  Upload,
  Undo,
  Redo,
  Save,
  FileText,
  Maximize2,
  Minimize2,
  Settings,
  Copy,
  Plus,
  CheckCircle,
} from 'lucide-react';
import { EditorToolbar } from './EditorToolbar';
import { ColorPicker } from './ColorPicker';
import { ClassEditor } from './ClassEditor';
import { EditorPreview } from './EditorPreview';
import { CodeEditor } from './CodeEditor';

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  public_id?: string;
}

export function RichTextEditor() {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submittedContent, setSubmittedContent] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showClassEditor, setShowClassEditor] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
 
  const [lineNumbers, setLineNumbers] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoSave && content) {
      const timer = setTimeout(() => {
        localStorage.setItem('rich-text-editor-content', content);
        setSuccessMessage('Auto-saved successfully!');
        setTimeout(() => setSuccessMessage(''), 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, autoSave]);

  useEffect(() => {
    const saved = localStorage.getItem('rich-text-editor-content');
    if (saved) {
      setContent(saved);
      handleContentChange(saved);
    }
  }, []);

  const addToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const handleUploads = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tanvir7462');
    formData.append('cloud_name', 'dsmbm1bvy');
    formData.append('folder', 'RichTextEditor_Images');

    const cloudinaryURL = 'https://api.cloudinary.com/v1_1/dsmbm1bvy/image/upload';

    try {
      const response = await fetch(cloudinaryURL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleImageUpload = async (files: FileList) => {
    setIsLoading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      const filesArray = Array.from(files);
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        if (!file.type.startsWith('image/')) {
          setUploadError(`${file.name} is not an image file`);
          continue;
        }

        try {
          setUploadProgress((i / filesArray.length) * 50);
          const uploadedData = await handleUploads(file);

          if (!uploadedData?.secure_url) {
            throw new Error('No secure URL returned from Cloudinary');
          }

          setUploadProgress(((i + 1) / filesArray.length) * 100);

          const imageData = {
            id: Date.now().toString() + Math.random(),
            url: uploadedData.secure_url,
            name: file.name,
            public_id: uploadedData.public_id,
          };

          setUploadedImages((prev) => [...prev, imageData]);

          const imgMarkup = `<img src="${imageData.url}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;

          const newContent = content + imgMarkup;
          setContent(newContent);
          addToHistory(newContent);

          setSuccessMessage(`${file.name} uploaded successfully!`);
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
          console.error('Image upload error:', error);
          setUploadError(`Failed to upload ${file.name}`);
        }
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const applyFormat = (format: string, value: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = '';
    const placeholder = selectedText || 'text';

    switch (format) {
      case 'bold':
        newText = `${beforeText}<strong style="font-weight: bold;">${placeholder}</strong>${afterText}`;
        break;
      case 'italic':
        newText = `${beforeText}<em style="font-style: italic;">${placeholder}</em>${afterText}`;
        break;
      case 'underline':
        newText = `${beforeText}<u style="text-decoration: underline;">${placeholder}</u>${afterText}`;
        break;
      case 'strikethrough':
        newText = `${beforeText}<del style="text-decoration: line-through;">${placeholder}</del>${afterText}`;
        break;
      case 'h1':
        newText = `${beforeText}<h1 style="font-size: 2em; font-weight: bold; margin: 0.67em 0;">${placeholder}</h1>${afterText}`;
        break;
      case 'h2':
        newText = `${beforeText}<h2 style="font-size: 1.5em; font-weight: bold; margin: 0.75em 0;">${placeholder}</h2>${afterText}`;
        break;
      case 'h3':
        newText = `${beforeText}<h3 style="font-size: 1.17em; font-weight: bold; margin: 0.83em 0;">${placeholder}</h3>${afterText}`;
        break;
      case 'ul':
        if (selectedText) {
          const listItems = selectedText.split('\n').map((line) => `<li style="margin: 0.5em 0;">${line}</li>`).join('');
          newText = `${beforeText}<ul style="list-style-type: disc; margin: 1em 0; padding-left: 2.5em;">${listItems}</ul>${afterText}`;
        } else {
          newText = `${beforeText}<ul style="list-style-type: disc; margin: 1em 0; padding-left: 2.5em;"><li style="margin: 0.5em 0;">${placeholder}</li></ul>${afterText}`;
        }
        break;
      case 'ol':
        if (selectedText) {
          const listItems = selectedText.split('\n').map((line) => `<li style="margin: 0.5em 0;">${line}</li>`).join('');
          newText = `${beforeText}<ol style="list-style-type: decimal; margin: 1em 0; padding-left: 2.5em;">${listItems}</ol>${afterText}`;
        } else {
          newText = `${beforeText}<ol style="list-style-type: decimal; margin: 1em 0; padding-left: 2.5em;"><li style="margin: 0.5em 0;">${placeholder}</li></ol>${afterText}`;
        }
        break;
      case 'code':
        newText = `${beforeText}<code style="background-color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: 'Courier New', monospace;">${placeholder}</code>${afterText}`;
        break;
      case 'blockquote':
        newText = `${beforeText}<blockquote style="border-left: 4px solid #d1d5db; padding-left: 1em; margin: 1em 0; color: #6b7280; font-style: italic;">${placeholder}</blockquote>${afterText}`;
        break;
      case 'hr':
        newText = `${beforeText}<hr style="border: none; border-top: 2px solid #d1d5db; margin: 2em 0;" />${afterText}`;
        break;
      case 'br':
        newText = `${beforeText}<br />${afterText}`;
        break;
      case 'link':
        if (value) {
          newText = `${beforeText}<a href="${value}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${placeholder}</a>${afterText}`;
        } else {
          setShowLinkInput(true);
          setLinkText(placeholder);
          return;
        }
        break;
      case 'table':
        newText = `${beforeText}<table style="border-collapse: collapse; width: 100%; margin: 1em 0; border: 1px solid #d1d5db;">
  <thead>
    <tr>
      <th style="background-color: #f3f4f6; font-weight: bold; padding: 0.75em; border: 1px solid #d1d5db;">Header 1</th>
      <th style="background-color: #f3f4f6; font-weight: bold; padding: 0.75em; border: 1px solid #d1d5db;">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 0.75em; border: 1px solid #d1d5db;">Cell 1</td>
      <td style="padding: 0.75em; border: 1px solid #d1d5db;">Cell 2</td>
    </tr>
  </tbody>
</table>${afterText}`;
        break;
      case 'subscript':
        newText = `${beforeText}<sub style="font-size: 0.75em; vertical-align: sub;">${placeholder}</sub>${afterText}`;
        break;
      case 'superscript':
        newText = `${beforeText}<sup style="font-size: 0.75em; vertical-align: super;">${placeholder}</sup>${afterText}`;
        break;
      case 'align-left':
        newText = `${beforeText}<div style="text-align: left;">${placeholder}</div>${afterText}`;
        break;
      case 'align-center':
        newText = `${beforeText}<div style="text-align: center;">${placeholder}</div>${afterText}`;
        break;
      case 'align-right':
        newText = `${beforeText}<div style="text-align: right;">${placeholder}</div>${afterText}`;
        break;
      case 'align-justify':
        newText = `${beforeText}<div style="text-align: justify;">${placeholder}</div>${afterText}`;
        break;
      default:
        return;
    }

    const updatedContent = newText;
    setContent(updatedContent);
    addToHistory(updatedContent);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newText.length - content.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleApplyColor = (type: 'text' | 'background', color: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const placeholder = selectedText || 'text';
    let newText = '';

    if (type === 'text') {
      newText = `${beforeText}<span style="color: ${color};">${placeholder}</span>${afterText}`;
    } else {
      newText = `${beforeText}<span style="background-color: ${color}; padding: 0.2em 0.4em; border-radius: 0.25em;">${placeholder}</span>${afterText}`;
    }

    setContent(newText);
    addToHistory(newText);
    setShowColorPicker(false);
  };

  const handleApplyClasses = (classes: string) => {
    if (!textareaRef.current || !classes.trim()) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const placeholder = selectedText || 'text';
    const newText = `${beforeText}<span class="${classes}">${placeholder}</span>${afterText}`;

    setContent(newText);
    addToHistory(newText);
    setShowClassEditor(false);
  };

  const handleApplyRawCSS = (css: string) => {
    if (!textareaRef.current || !css.trim()) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const placeholder = selectedText || 'text';
    const newText = `${beforeText}<span style="${css}">${placeholder}</span>${afterText}`;

    setContent(newText);
    addToHistory(newText);
    setShowClassEditor(false);
  };

  const handleDone = () => {
    if (!content.trim()) {
      setUploadError('Please add some content before marking as done!');
      return;
    }

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `html-content-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);

    setSuccessMessage('HTML file downloaded successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      const linkTextToUse = linkText || linkUrl;
      const linkMarkup = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${linkTextToUse}</a>`;

      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        const newContent = selectedText
          ? `${beforeText}<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${selectedText}</a>${afterText}`
          : `${beforeText}${linkMarkup}${afterText}`;

        setContent(newContent);
        addToHistory(newContent);
      }

      setShowLinkInput(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setCharCount(newContent.length);
    setWordCount(
      newContent
        .trim()
        .split(/\s+/)
        .filter((w) => w).length
    );
  };

  const handleClear = () => {
    if (
      content &&
      window.confirm('Are you sure you want to clear all content? This action cannot be undone.')
    ) {
      setContent('');
      setCharCount(0);
      setWordCount(0);
      setUploadedImages([]);
      setShowImagePreview(false);
      setUploadError('');
      addToHistory('');
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      setUploadError('Please add some content before submitting!');
      return;
    }
    setSubmittedContent(content);
    setShowPreview(true);
    setUploadError('');
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(submittedContent);
    setSuccessMessage('HTML copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSave = () => {
    localStorage.setItem('rich-text-editor-content', content);
    setSuccessMessage('Content saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('rich-text-editor-content');
    if (saved) {
      setContent(saved);
      handleContentChange(saved);
      setSuccessMessage('Content loaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setUploadError('No saved content found!');
    }
  };

  const handleExport = (format: 'html' | 'txt' | 'md') => {
    const contentToExport = submittedContent || content;
    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'html':
        blob = new Blob([contentToExport], { type: 'text/html' });
        filename = `content-${Date.now()}.html`;
        break;
      case 'txt':
        blob = new Blob([contentToExport.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
        filename = `content-${Date.now()}.txt`;
        break;
      case 'md':
        blob = new Blob([contentToExport], { type: 'text/markdown' });
        filename = `content-${Date.now()}.md`;
        break;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertImage = (imageId: string) => {
    const image = uploadedImages.find((img) => img.id === imageId);
    if (image && textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(start);
      const imgMarkup = `<img src="${image.url}" alt="${image.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;
      const newContent = beforeText + imgMarkup + afterText;
      setContent(newContent);
      addToHistory(newContent);
    }
  };

  const removeImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const copyImageUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white text-black ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className={`mx-auto ${isFullscreen ? 'px-4' : 'max-w-7xl px-4 md:px-8'} py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Rich Text Editor</h1>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleUndo} disabled={historyIndex <= 0}>
                  <Undo className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                  <Redo className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleLoad}>
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <div>
                  <span className="text-xs text-gray-600">Chars: </span>
                  <span className="text-sm font-semibold text-gray-900">{charCount}</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div>
                  <span className="text-xs text-gray-600">Words: </span>
                  <span className="text-sm font-semibold text-gray-900">{wordCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>

                <Button size="sm" variant="outline" onClick={() => setShowSettings(!showSettings)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {showSettings && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Editor Settings</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span>Auto Save</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={wordWrap}
                    onChange={(e) => setWordWrap(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span>Word Wrap</span>
                </label>
            
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={lineNumbers}
                    onChange={(e) => setLineNumbers(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span>Line Numbers</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto ">
        <div className={`mx-auto ${isFullscreen ? 'px-2' : 'max-w-7xl '} py-8`}>
          <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            <div className="space-y-4">
              <EditorToolbar
                onFormat={applyFormat}
                onImageUpload={() => fileInputRef.current?.click()}
                onShowColorPicker={() => setShowColorPicker(!showColorPicker)}
                onShowClassEditor={() => setShowClassEditor(!showClassEditor)}
                isLoading={isLoading}
                uploadedImagesCount={uploadedImages.length}
                onToggleImagePreview={() => setShowImagePreview(!showImagePreview)}
              />

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                disabled={isLoading}
              />

              {showColorPicker && <ColorPicker onApplyColor={handleApplyColor} onClose={() => setShowColorPicker(false)} />}

              {showClassEditor && (
                <ClassEditor
                  onApplyClasses={handleApplyClasses}
                  onApplyRawCSS={handleApplyRawCSS}
                  onClose={() => setShowClassEditor(false)}
                />
              )}

              {showLinkInput && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Link URL</label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Link Text (optional)</label>
                    <input
                      type="text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Link text"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleInsertLink} className="bg-gray-800 text-white hover:bg-gray-900">
                      Insert Link
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowLinkInput(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gray-800 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs text-gray-600 text-center">Uploading: {Math.round(uploadProgress)}%</p>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
                  <AlertCircle className="w-4 h-4" />
                  {uploadError}
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-2">
                  <Check className="w-4 h-4" />
                  {successMessage}
                </div>
              )}

              <div
                className={`relative rounded-xl border-2 transition-all bg-white ${
                  dragOver ? 'border-gray-600 bg-gray-50' : 'border-gray-300'
                } ${isFocused ? 'ring-2 ring-gray-400 ring-opacity-50' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files) handleImageUpload(e.dataTransfer.files);
                }}
              >
                {lineNumbers ? (
                  <div className="relative">
                    {lineNumbers && (
                      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gray-50 border-r border-gray-300 text-gray-600 text-xs font-mono  p-2 select-none overflow-hidden">
                        {content.split('\n').map((_, i) => (
                          <div key={i} className="leading-relaxed">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ marginLeft: lineNumbers ? '48px' : '0' }}>
                      <CodeEditor
                        value={content}
                        onChange={handleContentChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        wordWrap={wordWrap}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {lineNumbers && (
                      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 border-r border-gray-300 text-gray-600 text-xs font-mono p-4 select-none overflow-hidden">
                        {content.split('\n').map((_, i) => (
                          <div key={i} className="leading-relaxed">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    )}
                    <textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Start typing your HTML content here..."
                      className="w-full p-4 min-h-96 resize-none font-mono text-sm focus:outline-none bg-transparent text-gray-900 placeholder-gray-400 leading-relaxed"
                      style={{
                        whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                        marginLeft: lineNumbers ? '48px' : '0',
                      }}
                    />
                  </div>
                )}
                {dragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80 rounded-lg pointer-events-none border-2 border-gray-400 border-dashed">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-700 font-semibold">Drop images here to upload</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 flex-wrap">
                <Button onClick={handleClear} variant="outline" className="flex-1 min-w-32 border-red-300 text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Button onClick={handleSubmit} disabled={!content.trim()} className="flex-1 min-w-32 bg-gray-700 text-white hover:bg-gray-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleDone} disabled={!content.trim()} className="flex-1 min-w-32 bg-gray-900 text-white hover:bg-gray-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>

            {showPreview && submittedContent && (
              <EditorPreview content={submittedContent} onClose={() => setShowPreview(false)} onCopy={copyHTML} onExport={handleExport} />
            )}
          </div>

          {showImagePreview && uploadedImages.length > 0 && !showPreview && (
            <div className="mt-6 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Images ({uploadedImages.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-all">
                      <div className="relative h-32 overflow-hidden bg-white">
                        <img src={image.url} alt={image.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Button size="sm" variant="secondary" onClick={() => insertImage(image.id)} title="Insert image" className="h-8 w-8 p-0 bg-white hover:bg-gray-100">
                            <Plus className="w-3 h-3 text-gray-700" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeImage(image.id)} title="Remove image" className="h-8 w-8 p-0 bg-white hover:bg-gray-100">
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <p className="text-xs text-gray-600 truncate" title={image.name}>
                          {image.name}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyImageUrl(image.url, image.id)}
                          className="w-full h-7 text-xs border-gray-300 hover:bg-gray-50 gap-1"
                        >
                          {copiedId === image.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy URL
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm text-gray-600">
          <p>Advanced Rich Text Editor with Dynamic Styling</p>
        </div>
      </footer>
    </div>
  );
}
