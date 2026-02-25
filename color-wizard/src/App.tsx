import { useEffect } from 'react';
import { useColorStore } from './store/colorStore';
import { PaletteDisplay } from './components/core/PaletteGrid/PaletteDisplay';
import { PreviewPanel } from './components/core/PreviewPanel/PreviewPanel';
import { ColorPicker } from './components/core/ColorPicker/ColorPicker';
import { StrategySelector } from './components/core/StrategySelector/StrategySelector';
import { CodeBlock } from './components/ui/CodeBlock/CodeBlock';
import { ColorPaletteGenerator } from './lib/color/algorithms/generator';
import { Wand2, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const { baseColor, palette, strategy, setStrategy, setBaseColor, randomize, generatePalette } = useColorStore();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    generatePalette();
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const cssCode = palette.map((color, i) =>
    `--color-${i + 1}: ${ColorPaletteGenerator.toCss(color)};`
  ).join('\n');

  const jsonCode = JSON.stringify(palette.map(c => ColorPaletteGenerator.toHex(c)), null, 2);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-sm"></div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {t('app.title')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Languages size={18} />
              <span>{i18n.language === 'en' ? '中文' : 'English'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">

            {/* Base Color Picker */}
            <ColorPicker color={baseColor} onChange={setBaseColor} />

            <div className="flex items-center gap-4 w-full md:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('app.strategy')}:</label>
              <StrategySelector value={strategy} onChange={setStrategy} />
            </div>
          </div>

          <button
            onClick={randomize}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-md active:scale-95 w-full md:w-auto justify-center"
          >
            <Wand2 size={18} />
            <span>{t('app.generate')}</span>
          </button>
        </div>

        {/* Main Display */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
              {t('app.currentPalette')}
            </h2>
            <PaletteDisplay palette={palette} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">{t('app.realtimePreview')}</h2>
              <PreviewPanel palette={palette} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">{t('app.exportCode')}</h2>
              <div className="bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg overflow-x-auto">
                <CodeBlock label={t('app.cssVars')} code={cssCode} language="css" />
                <div className="h-px bg-gray-800 my-4"></div>
                <CodeBlock label={t('app.json')} code={jsonCode} language="json" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
