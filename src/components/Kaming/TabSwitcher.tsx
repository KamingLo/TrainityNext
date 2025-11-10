// src/components/product/TabSwitcher.tsx
interface Tab {
  key: string;
  label: string;
}

interface TabSwitcherProps<T extends string> {
  tabs: { key: T; label: string }[];
  activeTab: T;
  onTabClick: (tab: T) => void;
}

export default function TabSwitcher<T extends string>({
  tabs,
  activeTab,
  onTabClick,
}: TabSwitcherProps<T>) {
  return (
    <div className="flex justify-center my-10">
      <div className="flex gap-4 bg-black/40 backdrop-blur-md rounded-full border border-gray-700 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab.key)}
            className={`px-5 py-2 rounded-full transition-all ${
              activeTab === tab.key
                ? "bg-white text-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}