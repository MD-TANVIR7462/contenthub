import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, X } from 'lucide-react';

interface ColorPickerProps {
  onApplyColor: (type: 'text' | 'background', color: string) => void;
  onClose: () => void;
}

export function ColorPicker({ onApplyColor, onClose }: ColorPickerProps) {
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [customTextColor, setCustomTextColor] = useState('');
  const [customBgColor, setCustomBgColor] = useState('');

  const presetColors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Cyan', value: '#06b6d4' },
  ];

  const handleApplyTextColor = () => {
    const color = customTextColor || textColor;
    onApplyColor('text', color);
  };

  const handleApplyBgColor = () => {
    const color = customBgColor || backgroundColor;
    onApplyColor('background', color);
  };

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-700" />
          <h3 className="text-sm font-semibold text-gray-900">Color Picker</h3>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Text Color</label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
            />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Selected:</p>
              <p className="text-sm font-mono font-semibold">{textColor}</p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setTextColor(color.value)}
                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-600 transition-colors"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>

          <input
            type="text"
            value={customTextColor}
            onChange={(e) => setCustomTextColor(e.target.value)}
            placeholder="Or enter hex color (e.g., #ff5733)"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />

          <Button
            size="sm"
            onClick={handleApplyTextColor}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            Apply Text Color
          </Button>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Background Color</label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
            />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Selected:</p>
              <p className="text-sm font-mono font-semibold">{backgroundColor}</p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setBackgroundColor(color.value)}
                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-600 transition-colors"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>

          <input
            type="text"
            value={customBgColor}
            onChange={(e) => setCustomBgColor(e.target.value)}
            placeholder="Or enter hex color (e.g., #fef3c7)"
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />

          <Button
            size="sm"
            onClick={handleApplyBgColor}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            Apply Background Color
          </Button>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          Select text in the editor first, then apply colors to wrap it with styled spans.
        </p>
      </div>
    </div>
  );
}
