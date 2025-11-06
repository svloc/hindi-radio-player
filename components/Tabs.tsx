import React from 'react';

type Tab = 'all' | 'favorites';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: 'All Stations' },
    { id: 'favorites', label: 'Favorites' },
  ];

  return (
    <nav className="flex space-x-2 bg-slate-800/60 p-1 rounded-lg" aria-label="Station Filters">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-900
            ${
              activeTab === tab.id
                ? 'bg-pink-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }
          `}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;
