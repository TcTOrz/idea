import React, { useRef, useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import type { ColorHSL } from '../../../types';
import { ColorPaletteGenerator } from '../../../lib/color/algorithms/generator';
import chroma from 'chroma-js';
import { Palette as PaletteIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ColorPickerProps {
  color: ColorHSL;
  onChange: (color: ColorHSL) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const popover = useRef<HTMLDivElement>(null);
  const currentHex = ColorPaletteGenerator.toHex(color);

  // Local state for input value to allow typing
  const [inputValue, setInputValue] = useState(currentHex);

  // Sync local input state when color prop changes (e.g. via randomizer or picker)
  useEffect(() => {
    // Only update input value if the new color is semantically different from current input
    // This prevents expanding short hex (e.g. #abc) to full hex (e.g. #aabbcc) while typing
    if (chroma.valid(inputValue) && chroma(inputValue).hex() === currentHex) {
      return;
    }
    setInputValue(currentHex);
  }, [currentHex]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popover.current && !popover.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorChange = (newHex: string) => {
    const [h, s, l] = chroma(newHex).hsl();
    onChange({
      h: isNaN(h) ? 0 : h,
      s: isNaN(s) ? 0 : s * 100,
      l: isNaN(l) ? 0 : l * 100
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    if (chroma.valid(newVal)) {
      handleColorChange(newVal);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('app.baseColor')}:</label>
        <button
          className="w-10 h-10 rounded-lg border-2 border-white shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center ring-1 ring-gray-200"
          style={{ backgroundColor: currentHex }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Pick base color"
        >
          {!isOpen && <PaletteIcon size={16} className="text-white drop-shadow-md opacity-50" />}
        </button>
      </div>

      {isOpen && (
        <div
          ref={popover}
          className="absolute z-50 top-full mt-2 left-0 p-3 bg-white rounded-xl shadow-xl border border-gray-100"
        >
          <HexColorPicker color={currentHex} onChange={handleColorChange} />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">HEX</span>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 uppercase font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
