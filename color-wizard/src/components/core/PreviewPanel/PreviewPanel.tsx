import React from 'react';
import type { ColorHSL } from '../../../types';
import { ColorPaletteGenerator } from '../../../lib/color/algorithms/generator';
import { useTranslation } from 'react-i18next';

interface PreviewPanelProps {
  palette: ColorHSL[];
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ palette }) => {
  const { t } = useTranslation();

  if (palette.length < 5) return null;

  const primary = ColorPaletteGenerator.toCss(palette[0]);
  const secondary = ColorPaletteGenerator.toCss(palette[1]);
  const accent = ColorPaletteGenerator.toCss(palette[2]);
  const background = ColorPaletteGenerator.toCss({ ...palette[4], l: 95 });
  const surface = '#ffffff';
  const text = '#1f2937';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{t('preview.title')}</h3>
      
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm" style={{ backgroundColor: background }}>
        {/* Header */}
        <header className="p-4 flex justify-between items-center text-white" style={{ backgroundColor: primary }}>
          <div className="font-bold">{t('preview.brand')}</div>
          <nav className="flex gap-4 text-sm">
            <span>{t('preview.home')}</span>
            <span>{t('preview.about')}</span>
            <span>{t('preview.contact')}</span>
          </nav>
        </header>

        {/* Hero */}
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: text }}>{t('preview.heroTitle')}</h1>
          <p className="mb-6 opacity-70" style={{ color: text }}>{t('preview.heroDesc')}</p>
          <div className="flex justify-center gap-4">
            <button 
              className="px-4 py-2 rounded-lg font-medium transition-transform active:scale-95 shadow-md"
              style={{ backgroundColor: primary, color: 'white' }}
            >
              {t('preview.getStarted')}
            </button>
            <button 
              className="px-4 py-2 rounded-lg font-medium border transition-colors hover:bg-opacity-10"
              style={{ borderColor: primary, color: primary, backgroundColor: 'transparent' }}
            >
              {t('preview.learnMore')}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: surface }}>
            <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center text-white" style={{ backgroundColor: secondary }}>
              1
            </div>
            <h4 className="font-bold text-sm mb-1" style={{ color: text }}>{t('preview.secondary')}</h4>
            <p className="text-xs opacity-60">{t('preview.secondaryDesc')}</p>
          </div>
          <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: surface }}>
            <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
              2
            </div>
            <h4 className="font-bold text-sm mb-1" style={{ color: text }}>{t('preview.accent')}</h4>
            <p className="text-xs opacity-60">{t('preview.accentDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
