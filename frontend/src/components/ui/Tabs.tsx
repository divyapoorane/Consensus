import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-[#242424] text-[#F5F5F0] border border-[#383838] shadow-sm'
                : 'text-[#A1A1A1] hover:text-[#F5F5F0] hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-[#FF6B35]/20 text-[#FF7F50]' : 'bg-[#202020] text-[#A1A1A1]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
