"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  LinkIcon,
  Quote,
  ImageIcon,
  Trash2,
  Eye,
  Copy,
  Check,
  AlertCircle,
  Upload,
  Download,
  Maximize2,
  Minimize2,
  Plus,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Subscript,
  Superscript,
  Table,
  Undo,
  Redo,
  Save,
  FileText,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Settings,
  Minus,
  Columns,
  Rows,
  Strikethrough,
  Link2,
  Unlink,
} from "lucide-react";

export default function RichTextEditor() {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ id: string; url: string; name: string }>
  >([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submittedContent, setSubmittedContent] = useState("");
  const [fontSize, setFontSize] = useState("16px");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content) {
      const timer = setTimeout(() => {
        localStorage.setItem("rich-text-editor-content", content);
        setSuccessMessage("Auto-saved successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, autoSave]);

  // Load saved content
  useEffect(() => {
    const saved = localStorage.getItem("rich-text-editor-content");
    if (saved) {
      setContent(saved);
      handleContentChange(saved);
    }
  }, []);

  // History management
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
    formData.append("file", file);
    formData.append("upload_preset", "tanvir7462");
    formData.append("cloud_name", "dsmbm1bvy");
    formData.append("folder", "RichTextEditor_Images");

    const cloudinaryURL =
      "https://api.cloudinary.com/v1_1/dsmbm1bvy/image/upload";

    try {
      const response = await fetch(cloudinaryURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  const handleImageUpload = async (files: FileList) => {
    setIsLoading(true);
    setUploadError("");
    setUploadProgress(0);

    try {
      const filesArray = Array.from(files);
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        if (!file.type.startsWith("image/")) {
          setUploadError(`${file.name} is not an image file`);
          continue;
        }

        try {
          setUploadProgress((i / filesArray.length) * 50);
          const uploadedData = await handleUploads(file);

          if (!uploadedData?.secure_url) {
            throw new Error("No secure URL returned from Cloudinary");
          }

          setUploadProgress(((i + 1) / filesArray.length) * 100);

          const imageData = {
            id: Date.now().toString() + Math.random(),
            url: uploadedData.secure_url,
            name: file.name,
            public_id: uploadedData.public_id, // Store Cloudinary public_id for future management
            format: uploadedData.format,
            bytes: uploadedData.bytes,
            width: uploadedData.width,
            height: uploadedData.height,
          };

          setUploadedImages((prev) => [...prev, imageData]);

          // Use proper HTML image tag with database-friendly attributes
          const imgMarkup = `<img src="${imageData.url}" alt="${file.name}" class="rich-text-image" data-image-id="${imageData.id}" data-public-id="${imageData.public_id}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;

          const newContent = content + imgMarkup;
          setContent(newContent);
          addToHistory(newContent);

          setSuccessMessage(`${file.name} uploaded successfully!`);
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
          console.error("Image upload error:", error);
          setUploadError(`Failed to upload ${file.name}`);
        }
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };
  const applyFormat = (format: string, value: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = "";
    const placeholder = selectedText || "text";

    switch (format) {
      case "bold":
        newText = `${beforeText}<strong>${placeholder}</strong>${afterText}`;
        break;
      case "italic":
        newText = `${beforeText}<em>${placeholder}</em>${afterText}`;
        break;
      case "underline":
        newText = `${beforeText}<u>${placeholder}</u>${afterText}`;
        break;
      case "strikethrough":
        newText = `${beforeText}<del>${placeholder}</del>${afterText}`;
        break;
      case "h1":
        newText = `${beforeText}<h1>${placeholder}</h1>${afterText}`;
        break;
      case "h2":
        newText = `${beforeText}<h2>${placeholder}</h2>${afterText}`;
        break;
      case "h3":
        newText = `${beforeText}<h3>${placeholder}</h3>${afterText}`;
        break;
      case "ul":
        if (selectedText) {
          // If text is selected, wrap it in list items
          const listItems = selectedText
            .split("\n")
            .map((line) => `<li>${line}</li>`)
            .join("");
          newText = `${beforeText}<ul>${listItems}</ul>${afterText}`;
        } else {
          newText = `${beforeText}<ul><li>${placeholder}</li></ul>${afterText}`;
        }
        break;
      case "ol":
        if (selectedText) {
          // If text is selected, wrap it in list items
          const listItems = selectedText
            .split("\n")
            .map((line) => `<li>${line}</li>`)
            .join("");
          newText = `${beforeText}<ol>${listItems}</ol>${afterText}`;
        } else {
          newText = `${beforeText}<ol><li>${placeholder}</li></ol>${afterText}`;
        }
        break;
      case "code":
        newText = `${beforeText}<code>${placeholder}</code>${afterText}`;
        break;
      case "codeblock":
        newText = `${beforeText}<pre><code>${placeholder}</code></pre>${afterText}`;
        break;
      case "blockquote":
        newText = `${beforeText}<blockquote>${placeholder}</blockquote>${afterText}`;
        break;
      case "hr":
        newText = `${beforeText}<hr />${afterText}`;
        break;
      case "link":
        if (value) {
          newText = `${beforeText}<a href="${value}" target="_blank" rel="noopener noreferrer">${placeholder}</a>${afterText}`;
        } else {
          setShowLinkInput(true);
          setLinkText(placeholder);
          return;
        }
        break;
      case "table":
        newText = `${beforeText}<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </tr>
  </tbody>
</table>${afterText}`;
        break;
      case "subscript":
        newText = `${beforeText}<sub>${placeholder}</sub>${afterText}`;
        break;
      case "superscript":
        newText = `${beforeText}<sup>${placeholder}</sup>${afterText}`;
        break;
      case "align-left":
        newText = `${beforeText}<div style="text-align: left;">${placeholder}</div>${afterText}`;
        break;
      case "align-center":
        newText = `${beforeText}<div style="text-align: center;">${placeholder}</div>${afterText}`;
        break;
      case "align-right":
        newText = `${beforeText}<div style="text-align: right;">${placeholder}</div>${afterText}`;
        break;
      case "align-justify":
        newText = `${beforeText}<div style="text-align: justify;">${placeholder}</div>${afterText}`;
        break;
      case "paragraph":
        newText = `${beforeText}<p>${placeholder}</p>${afterText}`;
        break;
      case "div":
        newText = `${beforeText}<div>${placeholder}</div>${afterText}`;
        break;
      case "span":
        newText = `${beforeText}<span>${placeholder}</span>${afterText}`;
        break;
      case "color":
        newText = `${beforeText}<span style="color: ${textColor};">${placeholder}</span>${afterText}`;
        break;
      case "background-color":
        newText = `${beforeText}<span style="background-color: ${backgroundColor};">${placeholder}</span>${afterText}`;
        break;
      case "font-size":
        newText = `${beforeText}<span style="font-size: ${fontSize};">${placeholder}</span>${afterText}`;
        break;
      case "image":
        if (value) {
          newText = `${beforeText}<img src="${value}" alt="${placeholder}" class="rich-text-image" />${afterText}`;
        }
        break;
      case "line-break":
        newText = `${beforeText}<br />${afterText}`;
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
  const handleInsertLink = () => {
    if (linkUrl) {
      const linkTextToUse = linkText || linkUrl;
      const linkMarkup = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="rich-text-link">${linkTextToUse}</a>`;

      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        const newContent = selectedText
          ? `${beforeText}<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${selectedText}</a>${afterText}`
          : `${beforeText}${linkMarkup}${afterText}`;

        setContent(newContent);
        addToHistory(newContent);
      }

      setShowLinkInput(false);
      setLinkUrl("");
      setLinkText("");
    }
  };
  const insertImage = (imageId: string) => {
    const image = uploadedImages.find((img) => img.id === imageId);
    if (image && textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(start);
      const imgMarkup = `\n![${image.name}](${image.url})\n`;
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
      window.confirm(
        "Are you sure you want to clear all content? This action cannot be undone."
      )
    ) {
      setContent("");
      setCharCount(0);
      setWordCount(0);
      setUploadedImages([]);
      setShowImagePreview(false);
      setUploadError("");
      addToHistory("");
    }
  };

  const handleCancel = () => {
    if (
      content &&
      window.confirm(
        "Are you sure you want to cancel? Unsaved changes will be lost."
      )
    ) {
      setContent("");
      setCharCount(0);
      setWordCount(0);
      setUploadedImages([]);
      setShowImagePreview(false);
      setUploadError("");
      setSuccessMessage("");
      setShowPreview(false);
      setSubmittedContent("");
      localStorage.removeItem("rich-text-editor-content");
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      setUploadError("Please add some content before submitting!");
      return;
    }
    setSubmittedContent(content);
    setShowPreview(true);
    setUploadError("");
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(submittedContent);
    setSuccessMessage("HTML copied to clipboard!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSave = () => {
    localStorage.setItem("rich-text-editor-content", content);
    setSuccessMessage("Content saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleLoad = () => {
    const saved = localStorage.getItem("rich-text-editor-content");
    if (saved) {
      setContent(saved);
      handleContentChange(saved);
      setSuccessMessage("Content loaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setUploadError("No saved content found!");
    }
  };

  const handleExport = (format: "html" | "txt" | "md") => {
    const contentToExport = submittedContent || content;
    let blob: Blob;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case "html":
        blob = new Blob([contentToExport], { type: "text/html" });
        filename = `content-${Date.now()}.html`;
        mimeType = "text/html";
        break;
      case "txt":
        blob = new Blob([contentToExport.replace(/<[^>]*>/g, "")], {
          type: "text/plain",
        });
        filename = `content-${Date.now()}.txt`;
        mimeType = "text/plain";
        break;
      case "md":
        blob = new Blob([contentToExport], { type: "text/markdown" });
        filename = `content-${Date.now()}.md`;
        mimeType = "text/markdown";
        break;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-white text-black ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div
          className={`mx-auto ${
            isFullscreen ? "px-4" : "max-w-7xl px-4 md:px-8"
          } py-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">
                Advanced Text Editor
              </h1>

              {/* Editor Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Redo className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSave}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLoad}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats and Settings */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="rounded-lg px-3 py-1 bg-gray-50 border border-gray-200">
                  <p className="text-xs text-gray-600">Characters</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {charCount}
                  </p>
                </div>
                <div className="rounded-lg px-3 py-1 bg-gray-50 border border-gray-200">
                  <p className="text-xs text-gray-600">Words</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {wordCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-12 text-center">
                  {zoom}%
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSettings(!showSettings)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Font Size
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="12px">Small</option>
                    <option value="16px">Medium</option>
                    <option value="18px">Large</option>
                    <option value="20px">X-Large</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <span className="text-sm self-center">{textColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <span className="text-sm self-center">
                      {backgroundColor}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Auto Save
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={wordWrap}
                        onChange={(e) => setWordWrap(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      Word Wrap
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 overflow-auto bg-gray-50"
        style={{ backgroundColor }}
      >
        <div
          className={`mx-auto ${
            isFullscreen ? "px-2" : "max-w-7xl px-4 md:px-8"
          } py-8`}
        >
          <div
            className={`grid gap-6 ${
              showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {/* Editor Section */}
            <div className="space-y-4">
              {/* Enhanced Toolbar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                {/* Formatting Tools */}
                <div className="flex flex-wrap gap-3">
                  {/* Text Formatting */}
                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("bold")}
                      title="Bold"
                      className="hover:bg-gray-200"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("italic")}
                      title="Italic"
                      className="hover:bg-gray-200"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("underline")}
                      title="Underline"
                      className="hover:bg-gray-200"
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("strikethrough")}
                      title="Strikethrough"
                      className="hover:bg-gray-200"
                    >
                      <Strikethrough className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-gray-300" />

                  {/* Headings */}
                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("h1")}
                      title="Heading 1"
                      className="hover:bg-gray-200"
                    >
                      <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("h2")}
                      title="Heading 2"
                      className="hover:bg-gray-200"
                    >
                      <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("h3")}
                      title="Heading 3"
                      className="hover:bg-gray-200"
                    >
                      <Heading3 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-gray-300" />

                  {/* Lists & Quotes */}
                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("ul")}
                      title="Bullet List"
                      className="hover:bg-gray-200"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("ol")}
                      title="Ordered List"
                      className="hover:bg-gray-200"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("blockquote")}
                      title="Quote"
                      className="hover:bg-gray-200"
                    >
                      <Quote className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-gray-300" />

                  {/* Code & Special */}
                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("code")}
                      title="Inline Code"
                      className="hover:bg-gray-200"
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("codeblock")}
                      title="Code Block"
                      className="hover:bg-gray-200"
                    >
                      <Columns className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("table")}
                      title="Insert Table"
                      className="hover:bg-gray-200"
                    >
                      <Table className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("hr")}
                      title="Horizontal Rule"
                      className="hover:bg-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-gray-300" />

                  {/* Alignment */}
                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("align-left")}
                      title="Align Left"
                      className="hover:bg-gray-200"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("align-center")}
                      title="Align Center"
                      className="hover:bg-gray-200"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("align-right")}
                      title="Align Right"
                      className="hover:bg-gray-200"
                    >
                      <AlignRight className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("align-justify")}
                      title="Justify"
                      className="hover:bg-gray-200"
                    >
                      <AlignJustify className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-gray-300" />

                  {/* Script & Links */}
                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("superscript")}
                      title="Superscript"
                      className="hover:bg-gray-200"
                    >
                      <Superscript className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("subscript")}
                      title="Subscript"
                      className="hover:bg-gray-200"
                    >
                      <Subscript className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applyFormat("link")}
                      title="Insert Link"
                      className="hover:bg-gray-200"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-gray-300" />

                  {/* Image Tools */}
                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <label className="cursor-pointer">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        title="Upload Image"
                        className="hover:bg-gray-200"
                        disabled={isLoading}
                      >
                        <span>
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              e.target.files &&
                              handleImageUpload(e.target.files)
                            }
                            disabled={isLoading}
                          />
                        </span>
                      </Button>
                    </label>

                    {uploadedImages.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowImagePreview(!showImagePreview)}
                        className="hover:bg-gray-200"
                        title={`View ${uploadedImages.length} image(s)`}
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs ml-1">
                          {uploadedImages.length}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Link Input Dialog */}
                {showLinkInput && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Link URL
                      </label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Link Text (optional)
                      </label>
                      <input
                        type="text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        placeholder="Link text"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleInsertLink}
                        className="bg-gray-800 text-white hover:bg-gray-900"
                      >
                        Insert Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowLinkInput(false)}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gray-800 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center">
                      Uploading: {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {/* Messages */}
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
              </div>

              {/* Text Area */}
              <div
                className={`relative rounded-xl border-2 transition-all ${
                  dragOver ? "border-gray-600 bg-gray-100" : "border-gray-300"
                } ${isFocused ? "ring-2 ring-gray-400 ring-opacity-50" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files)
                    handleImageUpload(e.dataTransfer.files);
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Start typing your content here..."
                  className="w-full p-4 min-h-96 resize-none font-mono text-sm focus:outline-none bg-transparent text-foreground placeholder-foreground/50 leading-relaxed"
                  style={{
                    fontSize: fontSize,
                    color: textColor,
                    whiteSpace: wordWrap ? "pre-wrap" : "pre",
                  }}
                />
                {dragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80 rounded-lg pointer-events-none border-2 border-gray-400 border-dashed">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-700 font-semibold">
                        Drop images here to upload
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 flex-wrap">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 min-w-24 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="flex-1 min-w-24 border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="flex-1 min-w-24 bg-gray-900 text-white hover:bg-gray-800"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && submittedContent && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Live Preview
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExport("html")}
                        className="border-gray-300 hover:bg-gray-50 gap-1"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-xs">HTML</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExport("md")}
                        className="border-gray-300 hover:bg-gray-50 gap-1"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-xs">MD</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExport("txt")}
                        className="border-gray-300 hover:bg-gray-50 gap-1"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-xs">TXT</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyHTML}
                        className="border-gray-300 hover:bg-gray-50 gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div
                    className="w-full max-h-96 overflow-auto bg-white text-gray-900 p-6 rounded-lg border border-gray-200 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: submittedContent }}
                  />
                </div>

                {/* HTML Code View */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    HTML Code
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto border border-gray-200">
                    <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
                      {submittedContent}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Preview Sidebar */}
          {showImagePreview && uploadedImages.length > 0 && !showPreview && (
            <div className="mt-6 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Uploaded Images ({uploadedImages.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.id}
                      className="group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-all"
                    >
                      <div className="relative h-32 overflow-hidden bg-white">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => insertImage(image.id)}
                            title="Insert image"
                            className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3 text-gray-700" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(image.id)}
                            title="Remove image"
                            className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <p
                          className="text-xs text-gray-600 truncate"
                          title={image.name}
                        >
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
          <p>
            Advanced Rich Text Editor • Press{" "}
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 text-xs">
              Ctrl + Z
            </kbd>{" "}
            to undo •{" "}
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 text-xs">
              Ctrl + Y
            </kbd>{" "}
            to redo
          </p>
        </div>
      </footer>
    </div>
  );
}
