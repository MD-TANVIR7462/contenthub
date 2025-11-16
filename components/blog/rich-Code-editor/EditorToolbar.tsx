import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Table,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Superscript,
  Subscript,
  Link2,
  ImageIcon,
  Palette,
  Type,
  Plus,
} from 'lucide-react';

interface EditorToolbarProps {
  onFormat: (format: string, value?: string) => void;
  onImageUpload: () => void;
  onShowColorPicker: () => void;
  onShowClassEditor: () => void;
  isLoading: boolean;
  uploadedImagesCount: number;
  onToggleImagePreview: () => void;
}

export function EditorToolbar({
  onFormat,
  onImageUpload,
  onShowColorPicker,
  onShowClassEditor,
  isLoading,
  uploadedImagesCount,
  onToggleImagePreview,
}: EditorToolbarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('bold')}
            title="Bold (Ctrl+B)"
            className="hover:bg-gray-200"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('italic')}
            title="Italic (Ctrl+I)"
            className="hover:bg-gray-200"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('underline')}
            title="Underline (Ctrl+U)"
            className="hover:bg-gray-200"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('strikethrough')}
            title="Strikethrough"
            className="hover:bg-gray-200"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('h1')}
            title="Heading 1"
            className="hover:bg-gray-200"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('h2')}
            title="Heading 2"
            className="hover:bg-gray-200"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('h3')}
            title="Heading 3"
            className="hover:bg-gray-200"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('ul')}
            title="Bullet List"
            className="hover:bg-gray-200"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('ol')}
            title="Numbered List"
            className="hover:bg-gray-200"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('blockquote')}
            title="Quote"
            className="hover:bg-gray-200"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('code')}
            title="Inline Code"
            className="hover:bg-gray-200"
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('table')}
            title="Insert Table"
            className="hover:bg-gray-200"
          >
            <Table className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('hr')}
            title="Horizontal Rule"
            className="hover:bg-gray-200"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('br')}
            title="Line Break"
            className="hover:bg-gray-200"
          >
            <Type className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('align-left')}
            title="Align Left"
            className="hover:bg-gray-200"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('align-center')}
            title="Align Center"
            className="hover:bg-gray-200"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('align-right')}
            title="Align Right"
            className="hover:bg-gray-200"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('align-justify')}
            title="Justify"
            className="hover:bg-gray-200"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('superscript')}
            title="Superscript"
            className="hover:bg-gray-200"
          >
            <Superscript className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('subscript')}
            title="Subscript"
            className="hover:bg-gray-200"
          >
            <Subscript className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFormat('link')}
            title="Insert Link"
            className="hover:bg-gray-200"
          >
            <Link2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={onImageUpload}
            title="Upload Image"
            className="hover:bg-gray-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </Button>
          {uploadedImagesCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleImagePreview}
              className="hover:bg-gray-200"
              title={`View ${uploadedImagesCount} image(s)`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs ml-1">{uploadedImagesCount}</span>
            </Button>
          )}
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={onShowColorPicker}
            title="Text & Background Colors"
            className="hover:bg-gray-200"
          >
            <Palette className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onShowClassEditor}
            title="Add Custom CSS Classes"
            className="hover:bg-gray-200"
          >
            <Type className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
