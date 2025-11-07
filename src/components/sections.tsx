import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  bg?: string;
}

export default function Section({
  id,
  className = "",
  children,
  bg = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`w-[90%] lg:w-[80%] mx-auto mt-24 md:pt-10 pt-10 md:pt-20 ${bg} ${className}`}
    >
      {children}
    </section>
  );
}
