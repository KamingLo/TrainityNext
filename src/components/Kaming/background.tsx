"use client";

import { ReactNode } from "react";
import Providers from "./sessionProviders";
import styles from "@/styles/kaming.module.css"; // Impor

export default function Background({ children }: { children: ReactNode }) {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.blurSpotTop} />
      <div className={styles.blurSpotBottom} />

      <div className={styles.noiseOverlay} />

      <div className={styles.contentWrapper}>
        <Providers>{children}</Providers>
      </div>
    </div>
  );
}