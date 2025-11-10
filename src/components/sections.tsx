import { ReactNode } from "react";
import styles from "@/styles/kaming.module.css"; // <-- Impor

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