"use client";

import { Search } from "lucide-react";

interface RouterLike {
  push: (url: string) => void;
}

interface NoCourseCardProps {
  router: RouterLike;
}

export default function NoCourseCard({ router }: NoCourseCardProps) {
  return (
    <div className="p-6 md:col-span-2 rounded-xl bg-gray-900 border border-gray-800 border-dashed flex flex-col items-center justify-center text-center h-full">
      <Search className="w-12 h-12 text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Anda Belum Memulai Kursus</h3>
      <p className="text-gray-400 mb-6">Cari kursus yang Anda minati untuk memulai perjalanan!</p>
      <button
        onClick={() => router.push("/kursus")}
        className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium"
      >
        Cari Kursus
      </button>
    </div>
  );
}