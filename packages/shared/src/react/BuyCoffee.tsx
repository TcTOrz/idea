import React, { useState } from 'react';
import { Coffee, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import aliPayImg from '../assets/aliPay.jpg';
import wechatPayImg from '../assets/wechatPay.png';

export interface BuyCoffeeProps {
  title?: string;
  desc?: string;
}

export const BuyCoffee: React.FC<BuyCoffeeProps> = ({ title, desc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const getTitle = () => {
    if (title) return title;
    if (i18n.exists('app.coffee.title')) return t('app.coffee.title');
    if (i18n.exists('coffee.title')) return t('coffee.title');
    return 'Buy me a coffee';
  };

  const getDesc = () => {
    if (desc) return desc;
    if (i18n.exists('app.coffee.desc')) return t('app.coffee.desc');
    if (i18n.exists('coffee.desc')) return t('coffee.desc');
    return 'If you like this project, please consider buying me a coffee!';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        title={getTitle()}
      >
        <Coffee size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 transform transition-all animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              {getTitle()}
            </h2>
            
            <p className="text-center text-gray-600 mb-6">
              {getDesc()}
            </p>

            <div className="flex justify-center gap-6">
              <div className="text-center">
                <img 
                  src={wechatPayImg} 
                  alt="WeChat Pay" 
                  className="w-36 h-48 object-contain border rounded-lg shadow-sm bg-white"
                />
                <p className="mt-2 text-sm text-gray-500">WeChat Pay</p>
              </div>
              <div className="text-center">
                <img 
                  src={aliPayImg} 
                  alt="AliPay" 
                  className="w-36 h-48 object-contain border rounded-lg shadow-sm bg-white"
                />
                <p className="mt-2 text-sm text-gray-500">AliPay</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
