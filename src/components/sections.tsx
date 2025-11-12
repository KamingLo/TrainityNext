import { ReactNode } from "react";

// DIUBAH: Impor dari common.module.css
import styles from "@/styles/kaming/common.module.css";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function Section({
  id,
  className = "",
  children,
}: SectionProps) {
  
  // Menggabungkan kelas default .section dengan kelas tambahan dari props
  const combinedClassName = `${styles.section} ${className}`.trim();

  return (
    <section
      id={id}
      className={combinedClassName}
    >
      {children}
    </section>
  );
}