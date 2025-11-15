"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  LinkIcon,
  Quote,
  ImageIcon,
  Plus,
  Trash2,
  Eye,
  Loader2,
  X,
  Copy,
  Check,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  onCancel?: () => void;
  onSubmit?: (content: string) => void;
}

export function RichTextEditor2({
  value,
  onChange,
  onCancel,
  onSubmit,
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ id: string; url: string; name: string }>
  >([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCharCount, setShowCharCount] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploads = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tanvir7462" as string);
    formData.append("cloud_name", "dsmbm1bvy" as string);
    // formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string)
    // formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string)
    formData.append("folder", "Siscotek_Images");

    // NEXT_PUBLIC_CLOUDINARY_URL='https://api.cloudinary.com/v1_1/dsmbm1bvy/image/upload'
    // NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dsmbm1bvy
    // NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tanvir7462

    const cloudinaryURL =
      "https://api.cloudinary.com/v1_1/dsmbm1bvy/image/upload";
    // const cloudinaryURL = process.env.NEXT_PUBLIC_CLOUDINARY_URL

    try {
      const response = await fetch(cloudinaryURL as string, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleImageUpload = async (files: FileList) => {
    setIsLoading(true);
    setImageError("");

    try {
      let successCount = 0;
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));

          try {
            const imgLink = await handleUploads(file);

            if (!imgLink?.secure_url) {
              throw new Error(`Failed to upload ${file.name}`);
            }

            const imageData = {
              id: Date.now().toString() + i,
              url: imgLink.secure_url,
              name: file.name,
            };

            setUploadedImages((prev) => [...prev, imageData]);
            const imgMarkup = `<img src="${imageData.url}" alt="${file.name}" class="max-w-full rounded-lg my-4" />`;
            onChange(value + imgMarkup);
            successCount++;
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
          }
        }
      }

      if (successCount === 0) {
        setImageError("Failed to upload images. Please try again.");
      } else if (successCount < totalFiles) {
        setImageError(`Uploaded ${successCount} of ${totalFiles} images`);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setImageError("Image upload failed. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const insertImage = (imageId: string) => {
    const image = uploadedImages.find((img) => img.id === imageId);
    if (image) {
      const textarea = document.querySelector(
        "textarea[data-editor]"
      ) as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(start);
        const imgMarkup = `\n<img src="${image.url}" alt="${image.name}" class="max-w-full rounded-lg my-4" />\n`;
        onChange(beforeText + imgMarkup + afterText);
      }
    }
  };

  const removeImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const copyImageUrl = (url: string, imageId: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(imageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const applyFormat = (format: string, value: string = "") => {
    const textarea = document.querySelector(
      "textarea[data-editor]"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = "";
    switch (format) {
      case "bold":
        newText = `${beforeText}<strong>${
          selectedText || "bold text"
        }</strong>${afterText}`;
        break;
      case "italic":
        newText = `${beforeText}<em>${
          selectedText || "italic text"
        }</em>${afterText}`;
        break;
      case "underline":
        newText = `${beforeText}<u>${
          selectedText || "underlined text"
        }</u>${afterText}`;
        break;
      case "strikethrough":
        newText = `${beforeText}<s>${
          selectedText || "strikethrough"
        }</s>${afterText}`;
        break;
      case "h1":
        newText = `${beforeText}<h1>${
          selectedText || "Heading 1"
        }</h1>${afterText}`;
        break;
      case "h2":
        newText = `${beforeText}<h2>${
          selectedText || "Heading 2"
        }</h2>${afterText}`;
        break;
      case "h3":
        newText = `${beforeText}<h3>${
          selectedText || "Heading 3"
        }</h3>${afterText}`;
        break;
      case "ul":
        newText = `${beforeText}<ul><li>${
          selectedText || "List item"
        }</li></ul>${afterText}`;
        break;
      case "ol":
        newText = `${beforeText}<ol><li>${
          selectedText || "List item"
        }</li></ol>${afterText}`;
        break;
      case "code":
        newText = `${beforeText}<code>${
          selectedText || "code"
        }</code>${afterText}`;
        break;
      case "blockquote":
        newText = `${beforeText}<blockquote class="border-l-4 border-primary pl-4 my-2">${
          selectedText || "Quote"
        }</blockquote>${afterText}`;
        break;
      case "link":
        newText = `${beforeText}<a href="${value}" class="text-primary underline">${
          selectedText || "Link"
        }</a>${afterText}`;
        break;
      case "p":
        newText = `${beforeText}<p>${
          selectedText || "Paragraph"
        }</p>${afterText}`;
        break;
      case "hr":
        newText = `${beforeText}<hr class="my-4" />${afterText}`;
        break;
    }

    onChange(newText);
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all content?")) {
      onChange("");
      setUploadedImages([]);
      setShowImagePreview(false);
    }
  };

  const charCount = value.replace(/<[^>]*>/g, "").length;
  const wordCount = value
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="editor-toolbar rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-3 flex flex-wrap gap-2 shadow-sm">
        {/* Text Formatting Group */}
        <div className="flex gap-1 bg-card/30 hover:bg-card/50 rounded-lg p-1 transition-colors">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("bold")}
            title="Bold (Ctrl+B)"
            className="editor-button hover:bg-primary/10"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("italic")}
            title="Italic (Ctrl+I)"
            className="editor-button hover:bg-primary/10"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("underline")}
            title="Underline"
            className="editor-button hover:bg-primary/10"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("strikethrough")}
            title="Strikethrough"
            className="editor-button hover:bg-primary/10"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border/30" />

        {/* Headings Group */}
        <div className="flex gap-1 bg-card/30 hover:bg-card/50 rounded-lg p-1 transition-colors">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("h2")}
            title="Heading 2"
            className="editor-button hover:bg-primary/10"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("h3")}
            title="Heading 3"
            className="editor-button hover:bg-primary/10"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border/30" />

        {/* Lists & Quotes Group */}
        <div className="flex gap-1 bg-card/30 hover:bg-card/50 rounded-lg p-1 transition-colors">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("ul")}
            title="Bullet List"
            className="editor-button hover:bg-primary/10"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("ol")}
            title="Ordered List"
            className="editor-button hover:bg-primary/10"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("blockquote")}
            title="Quote"
            className="editor-button hover:bg-primary/10"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border/30" />

        {/* Code & Media Group */}
        <div className="flex gap-1 bg-card/30 hover:bg-card/50 rounded-lg p-1 transition-colors">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat("code")}
            title="Code"
            className="editor-button hover:bg-primary/10"
          >
            <Code className="w-4 h-4" />
          </Button>
          <label className="cursor-pointer">
            <Button
              size="sm"
              variant="ghost"
              asChild
              title="Upload Image to Cloudinary"
              className="editor-button hover:bg-primary/10"
              disabled={isLoading}
            >
              <span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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
                    e.target.files && handleImageUpload(e.target.files)
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
              className="editor-button hover:bg-primary/10"
              title={`View ${uploadedImages.length} image${
                uploadedImages.length > 1 ? "s" : ""
              }`}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="h-6 w-px bg-border/30" />

        {/* Actions Group */}
        <div className="flex gap-1 bg-destructive/10 rounded-lg p-1 ml-auto">
          {onCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              title="Cancel"
              className="editor-button hover:bg-destructive/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            title="Clear all content"
            className="editor-button hover:bg-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isLoading && uploadProgress > 0 && (
        <div className="w-full bg-muted rounded-lg overflow-hidden">
          <div
            className="h-2 bg-primary transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
          <p className="text-xs text-muted-foreground p-2 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Error Message */}
      {imageError && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive flex items-start justify-between">
          <span>{imageError}</span>
          <button onClick={() => setImageError("")} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Area */}
      <div
        className={`upload-zone rounded-lg border-2 transition-all duration-200 ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border/50 bg-card/30"
        } ${isFocused ? "ring-2 ring-primary/50" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) {
            handleImageUpload(e.dataTransfer.files);
          }
        }}
      >
        <textarea
          data-editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="✨ Start typing your content... Drag images here or use the toolbar to insert them. Your Cloudinary images will be automatically uploaded!"
          className="w-full p-4 min-h-96 resize-none font-mono text-sm focus:outline-none bg-transparent text-foreground placeholder-foreground/50 leading-relaxed"
        />
      </div>

      {/* Character & Word Count */}
      {showCharCount && (
        <div className="flex gap-4 text-xs text-muted-foreground px-2">
          <span>Characters: {charCount}</span>
          <span>Words: {wordCount}</span>
        </div>
      )}

      {/* Image Preview Section */}
      {showImagePreview && uploadedImages.length > 0 && (
        <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            📸 Uploaded Images ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-border/50 bg-muted"
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => insertImage(image.id)}
                    className="h-8"
                    title="Insert image"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyImageUrl(image.url, image.id)}
                    className="h-8"
                    title="Copy URL"
                  >
                    {copiedId === image.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                    className="h-8"
                    title="Remove image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground truncate p-2 absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons Footer */}
      {onSubmit && (
        <div className="flex gap-2 justify-end pt-4 border-t border-border/50">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="gap-2">
              Cancel
            </Button>
          )}
          <Button
            onClick={() => onSubmit(value)}
            disabled={!value.trim()}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
