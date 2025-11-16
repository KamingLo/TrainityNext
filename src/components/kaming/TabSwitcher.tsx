// src/components/product/TabSwitcher.tsx

// DIUBAH: Impor dari common.module.css
import styles from "@/styles/kaming/common.module.css";

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