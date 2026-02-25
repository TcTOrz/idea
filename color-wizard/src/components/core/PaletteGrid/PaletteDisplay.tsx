import React from 'react';
import type { ColorHSL } from '../../../types';
import { ColorPaletteGenerator } from '../../../lib/color/algorithms/generator';
import { cn } from '../../../lib/utils/cn';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface PaletteDisplayProps {
  palette: ColorHSL[];
}

export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette }) => {
  const { t } = useTranslation();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-64 w-full rounded-xl overflow-hidden shadow-2xl">
      {palette.map((color, index) => {
        const hex = ColorPaletteGenerator.toHex(color);
        const hsl = ColorPaletteGenerator.toCss(color);
        const isLight = color.l > 60;

        return (
          <div
            key={index}
            className="relative group flex flex-col items-center justify-center transition-all duration-300 hover:flex-[1.5]"
            style={{ backgroundColor: hsl }}
          >
            <div className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2",
              isLight ? "text-gray-900" : "text-white"
            )}>
              <span className="font-mono font-bold text-lg">{hex}</span>
              <span className="text-xs opacity-80">{hsl}</span>
              <button
                onClick={() => copyToClipboard(hex, index)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
                title={t('actions.copyHex')}
              >
                {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
