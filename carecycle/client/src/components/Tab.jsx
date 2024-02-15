import React from "react";

const TabComponent = ({ tabs, currentTab, setCurrentTab }) => {
    return (
      <div className="flex justify-center gap-4 mb-8">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              px-6 py-3 rounded-full text-lg font-medium transition-colors duration-150 
              ${currentTab === tab.id ? 
                'bg-custom-teal text-white shadow-lg' : 
                'text-custom-teal hover:bg-custom-teal hover:bg-opacity-20'}`}
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    );
};


export default TabComponent;
