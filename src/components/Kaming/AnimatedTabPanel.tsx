// src/components/product/AnimatedTabPanel.tsx
import { motion } from "framer-motion";
import React from "react";

// DIUBAH: Impor hanya modul yang Anda butuhkan.
// .tabPanel ada di dalam common.module.css
import styles from "@/styles/kaming/common.module.css";

interface AnimatedTabPanelProps {
  children: React.ReactNode;
}

export default function AnimatedTabPanel({ children }: AnimatedTabPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      
      // Penggunaan ini sekarang sudah benar karena 'styles'
      // menunjuk ke file common.module.css
      className={styles.tabPanel}
    >
      {children}
    </motion.div>
  );
}