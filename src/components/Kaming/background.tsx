"use client";

import { ReactNode } from "react";

export default function Background({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full relative bg-gradient-to-b from-black via-[#0b0b0b] to-[#101010] text-white overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-700/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/10 blur-[200px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.06] bg-[url('/textures/noise.png')] mix-blend-overlay pointer-events-none" />

      <main className="relative z-10 pt-24">{children}</main>
    </div>
  );
}
