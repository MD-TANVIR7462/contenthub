import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Type, X, Plus } from 'lucide-react';

interface ClassEditorProps {
  onApplyClasses: (classes: string) => void;
  onApplyRawCSS: (css: string) => void;
  onClose: () => void;
}

export function ClassEditor({ onApplyClasses, onApplyRawCSS, onClose }: ClassEditorProps) {
  const [customClasses, setCustomClasses] = useState('');
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [rawCSS, setRawCSS] = useState('');
  const [activeTab, setActiveTab] = useState<'classes' | 'css'>('classes');

  const presetClasses = [
    { label: 'Text Large', value: 'text-lg' },
    { label: 'Text XL', value: 'text-xl' },
    { label: 'Text 2XL', value: 'text-2xl' },
    { label: 'Font Bold', value: 'font-bold' },
    { label: 'Font Semibold', value: 'font-semibold' },
    { label: 'Italic', value: 'italic' },
    { label: 'Underline', value: 'underline' },
    { label: 'Text Center', value: 'text-center' },
    { label: 'Text Right', value: 'text-right' },
    { label: 'Uppercase', value: 'uppercase' },
    { label: 'Lowercase', value: 'lowercase' },
    { label: 'Capitalize', value: 'capitalize' },
    { label: 'Padding', value: 'p-4' },
    { label: 'Margin', value: 'm-4' },
    { label: 'Shadow', value: 'shadow-lg' },
    { label: 'Rounded', value: 'rounded-lg' },
    { label: 'Border', value: 'border border-gray-300' },
    { label: 'Background Gray', value: 'bg-gray-100' },
  ];

  const togglePreset = (value: string) => {
    if (selectedPresets.includes(value)) {
      setSelectedPresets(selectedPresets.filter((c) => c !== value));
    } else {
      setSelectedPresets([...selectedPresets, value]);
    }
  };

  const handleApplyClasses = () => {
    const allClasses = [...selectedPresets, ...customClasses.split(' ').filter(c => c.trim())];
    const uniqueClasses = [...new Set(allClasses)].join(' ');
    onApplyClasses(uniqueClasses);
  };

  const handleApplyCSS = () => {
    if (rawCSS.trim()) {
      onApplyRawCSS(rawCSS.trim());
    }
  };

  const handleClear = () => {
    setSelectedPresets([]);
    setCustomClasses('');
    setRawCSS('');
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-gray-700" />
          <h3 className="text-sm font-semibold text-gray-900">CSS Styling Editor</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'classes'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CSS Classes
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'css'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Raw CSS
        </button>
      </div>

      {activeTab === 'classes' ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Preset Classes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-white border border-gray-200 rounded">
              {presetClasses.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => togglePreset(preset.value)}
                  className={`text-xs px-3 py-2 rounded border transition-colors ${
                    selectedPresets.includes(preset.value)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Custom Classes
            </label>
            <textarea
              value={customClasses}
              onChange={(e) => setCustomClasses(e.target.value)}
              placeholder="Enter custom Tailwind classes (e.g., text-blue-500 font-bold p-6)"
              className="w-full p-3 border border-gray-300 rounded text-sm font-mono min-h-20"
            />
          </div>

          <div className="p-3 bg-white border border-gray-200 rounded">
            <p className="text-xs text-gray-600 mb-2">Preview:</p>
            <p className="text-sm font-mono break-all text-gray-900">
              {[...selectedPresets, ...customClasses.split(' ').filter(c => c.trim())].join(' ') || 'No classes selected'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleApplyClasses}
              className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply Classes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="border-gray-300 hover:bg-gray-50"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Raw CSS (use px units)
            </label>
            <textarea
              value={rawCSS}
              onChange={(e) => setRawCSS(e.target.value)}
              placeholder="color: #ff5733; font-size: 18px; padding: 10px; background-color: #f0f0f0;"
              className="w-full p-3 border border-gray-300 rounded text-sm font-mono min-h-32"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-900">
              <strong>Tip:</strong> Enter CSS properties separated by semicolons. Always use px units for sizes (e.g., font-size: 16px; padding: 12px; margin: 8px;)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleApplyCSS}
              className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply CSS
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="border-gray-300 hover:bg-gray-50"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          Select text in the editor first, then apply styles to wrap it with a styled element.
        </p>
      </div>
    </div>
  );
}
