// src/components/product/AnimatedTabPanel.tsx
import { motion } from "framer-motion";
import React from "react";
import styles from "@/styles/kaming.module.css"; // Impor

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
      className={styles.tabPanel}
    >
      {children}
    </motion.div>
  );
}