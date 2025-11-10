// src/components/product/TabSwitcher.tsx
import styles from "@/styles/kaming.module.css"; // Impor

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
    <div className={styles.tabContainer}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab.key)}
            className={`${styles.tabButton} ${
              activeTab === tab.key ? styles.tabButtonActive : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}