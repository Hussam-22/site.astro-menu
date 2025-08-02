import React from "react";

export default function SideTabs({ tabs }) {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  return (
    <div className="bg-base-200 rounded-4xl p-4 flex flex-row gap-4">
      <div className="w-3/12 flex flex-col gap-2 py-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`w-full text-center text-xl p-2 rounded-4xl flex flex-row items-center gap-4 px-4  ${
              activeTabIndex === index
                ? "bg-primary text-white font-bold"
                : "bg-base-100"
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            <img src="src/assets/icons/cafe.svg" className="w-8 h-8" />
            <button key={index}>{tab.label}</button>
          </div>
        ))}
      </div>
      <div className="w-9/12 bg-base-100 p-2 rounded-4xl">
        <div className="flex flex-row items-center gap-4">
          <div className="px-4">
            <p className="text-3xl font-bold">
              {tabs[activeTabIndex].title || "Explore the use case"}
            </p>
            <p>{tabs[activeTabIndex].description}</p>
            <p className="text-7xl text-neutral-300 font-bold text-center capitalize">
              {tabs[activeTabIndex].benefit}
            </p>
          </div>
          <img
            src={tabs[activeTabIndex].imagePath}
            className="w-96 h-96 object-cover rounded-4xl"
          />
        </div>
      </div>
    </div>
  );
}
