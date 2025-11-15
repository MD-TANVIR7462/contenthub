'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Code, LinkIcon, Quote, ImageIcon, Plus, Trash2, Eye } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; name: string }>>([])
  const [showImagePreview, setShowImagePreview] = useState(false)

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            id: Date.now().toString(),
            url: e.target?.result as string,
            name: file.name,
          }
          setUploadedImages((prev) => [...prev, imageData])
          // Insert image markup into editor
          const imgMarkup = `<img src="${imageData.url}" alt="${file.name}" class="max-w-full rounded-lg my-4" />`
          onChange(value + imgMarkup)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const insertImage = (imageId: string) => {
    const image = uploadedImages.find((img) => img.id === imageId)
    if (image) {
      const textarea = document.querySelector('textarea[data-editor]') as HTMLTextAreaElement
      if (textarea) {
        const start = textarea.selectionStart
        const beforeText = textarea.value.substring(0, start)
        const afterText = textarea.value.substring(start)
        const imgMarkup = `\n<img src="${image.url}" alt="${image.name}" class="max-w-full rounded-lg my-4" />\n`
        onChange(beforeText + imgMarkup + afterText)
      }
    }
  }

  const removeImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const applyFormat = (format: string, value: string = '') => {
    const textarea = document.querySelector('textarea[data-editor]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    let newText = ''
    switch (format) {
      case 'bold':
        newText = `${beforeText}<strong>${selectedText || 'bold text'}</strong>${afterText}`
        break
      case 'italic':
        newText = `${beforeText}<em>${selectedText || 'italic text'}</em>${afterText}`
        break
      case 'underline':
        newText = `${beforeText}<u>${selectedText || 'underlined text'}</u>${afterText}`
        break
      case 'h2':
        newText = `${beforeText}<h2>${selectedText || 'Heading'}</h2>${afterText}`
        break
      case 'h3':
        newText = `${beforeText}<h3>${selectedText || 'Subheading'}</h3>${afterText}`
        break
      case 'ul':
        newText = `${beforeText}<ul><li>${selectedText || 'List item'}</li></ul>${afterText}`
        break
      case 'ol':
        newText = `${beforeText}<ol><li>${selectedText || 'List item'}</li></ol>${afterText}`
        break
      case 'code':
        newText = `${beforeText}<code>${selectedText || 'code'}</code>${afterText}`
        break
      case 'blockquote':
        newText = `${beforeText}<blockquote>${selectedText || 'Quote'}</blockquote>${afterText}`
        break
      case 'link':
        newText = `${beforeText}<a href="${value}">${selectedText || 'Link'}</a>${afterText}`
        break
      case 'p':
        newText = `${beforeText}<p>${selectedText || 'Paragraph'}</p>${afterText}`
        break
    }

    onChange(newText)
    setTimeout(() => {
      textarea.focus()
    }, 0)
  }

  return (
    <div className="space-y-4">
      <div className="editor-toolbar rounded-t-lg p-3 flex flex-wrap gap-2 border-b border-border/50">
        <div className="flex gap-1 bg-card/30 rounded-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('bold')}
            title="Bold (Ctrl+B)"
            className="editor-button"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('italic')}
            title="Italic (Ctrl+I)"
            className="editor-button"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('underline')}
            title="Underline"
            className="editor-button"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border/30" />

        <div className="flex gap-1 bg-card/30 rounded-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('h2')}
            title="Heading 2"
            className="editor-button"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('h3')}
            title="Heading 3"
            className="editor-button"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border/30" />

        <div className="flex gap-1 bg-card/30 rounded-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('ul')}
            title="Bullet List"
            className="editor-button"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('ol')}
            title="Ordered List"
            className="editor-button"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('blockquote')}
            title="Quote"
            className="editor-button"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border/30" />

        <div className="flex gap-1 bg-card/30 rounded-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyFormat('code')}
            title="Code"
            className="editor-button"
          >
            <Code className="w-4 h-4" />
          </Button>
          <label className="cursor-pointer">
            <Button
              size="sm"
              variant="ghost"
              asChild
              title="Upload Image"
              className="editor-button"
            >
              <span>
                <ImageIcon className="w-4 h-4" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                />
              </span>
            </Button>
          </label>
          {uploadedImages.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowImagePreview(!showImagePreview)}
              className="editor-button"
              title={`View ${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files) {
            handleImageUpload(e.dataTransfer.files)
          }
        }}
      >
        <textarea
          data-editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Start typing your blog post... Drag images here or use the toolbar to insert them."
          className="w-full p-4 min-h-96 resize-none font-mono text-sm focus:outline-none bg-transparent text-foreground placeholder-foreground/40"
        />
      </div>

      {showImagePreview && uploadedImages.length > 0 && (
        <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Uploaded Images ({uploadedImages.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group rounded-lg overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => insertImage(image.id)}
                    className="h-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                    className="h-8"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
