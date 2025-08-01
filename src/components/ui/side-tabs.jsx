import React from "react";

export default function SideTabs({ tabs }) {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  return (
    <div className="bg-base-200 rounded-4xl p-4 flex flex-row gap-4">
      <div className="w-4/12 flex flex-col gap-2 py-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`w-full text-center text-xl p-2 rounded-4xl  ${
              activeTabIndex === index
                ? "bg-primary text-white font-bold"
                : "bg-base-100"
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-8/12 bg-base-100 p-4 rounded-4xl"></div>
    </div>
  );
}
