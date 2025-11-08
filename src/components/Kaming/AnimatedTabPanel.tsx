// src/components/product/AnimatedTabPanel.tsx
import { motion } from "framer-motion";
import React from "react";

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
      className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-lg"
    >
      {children}
    </motion.div>
  );
}