import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ColorStrategy } from '../../../types';
import { cn } from '../../../lib/utils/cn';

interface StrategySelectorProps {
  value: ColorStrategy;
  onChange: (value: ColorStrategy) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  const strategies = Object.values(ColorStrategy).map(s => ({
    id: s,
    name: t(`strategies.${s}`),
    description: t(`strategiesDesc.${s}`, '') // We'll add descriptions later
  }));

  const selectedStrategy = strategies.find(s => s.id === value) || strategies[0];

  return (
    <div className="w-full md:w-64">
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-black/5 focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm border border-gray-200 hover:border-gray-300 transition-colors">
            <span className="block truncate font-medium text-gray-700">{selectedStrategy.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
              {strategies.map((strategy) => (
                <Listbox.Option
                  key={strategy.id}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-10 pr-4",
                      active ? "bg-purple-50 text-purple-900" : "text-gray-900"
                    )
                  }
                  value={strategy.id}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={cn(
                          "block truncate",
                          selected ? "font-medium" : "font-normal"
                        )}
                      >
                        {strategy.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
