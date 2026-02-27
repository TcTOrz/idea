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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[5px]">
          <div className="relative w-full max-w-[600px] bg-white rounded-[1.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 md:p-8 sm:p-6 p-4 transform transition-all animate-in fade-in zoom-in duration-300 w-[95%] md:w-[90%]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-[1.5rem] font-bold text-center text-gray-900 mb-2 mt-0">
              {getTitle()}
            </h2>
            
            <p className="text-center text-gray-500 mb-6 font-medium">
              {getDesc()}
            </p>

            <div className="flex justify-center gap-8 md:gap-8 gap-4 flex-wrap mt-6">
              <div className="text-center">
                <img 
                  src={wechatPayImg} 
                  alt="WeChat Pay" 
                  className="w-[200px] h-[280px] md:w-[200px] md:h-[280px] w-[150px] h-[210px] object-contain bg-white rounded-lg shadow-sm mb-2 border border-gray-200"
                />
                <p className="mt-2 text-sm text-gray-500 font-medium">WeChat Pay</p>
              </div>
              <div className="text-center">
                <img 
                  src={aliPayImg} 
                  alt="AliPay" 
                  className="w-[200px] h-[280px] md:w-[200px] md:h-[280px] w-[150px] h-[210px] object-contain bg-white rounded-lg shadow-sm mb-2 border border-gray-200"
                />
                <p className="mt-2 text-sm text-gray-500 font-medium">AliPay</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
