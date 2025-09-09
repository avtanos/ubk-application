'use client';

import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface NavigationTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function NavigationTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '' 
}: NavigationTabsProps) {
  return (
    <div className={`nav-tabs ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`nav-tab ${
            activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'
          }`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
