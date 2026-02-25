import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CodeBlockProps {
  label: string;
  code: string;
  language?: 'css' | 'json';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ label, code, language = 'css' }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-500 font-mono text-xs">// {label}</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
          title={t('actions.copyHex')} // We can reuse this or add a generic copy key
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">{t('actions.copied')}</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>{t('actions.copy')}</span>
            </>
          )}
        </button>
      </div>
      <pre className={`font-mono text-sm overflow-x-auto ${language === 'json' ? 'text-green-400' : 'text-gray-100'}`}>
        {code}
      </pre>
    </div>
  );
};
