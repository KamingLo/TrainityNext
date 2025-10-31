"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] lg:w-[80%] bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo/TrainityFullWhite.svg"
            alt="Logo"
            width={160}
            height={160}
            className="rounded-md"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-white font-medium">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <Link href="/kursus" className="hover:text-blue-400 transition">Kursus</Link>
          <Link href="/lainnya" className="hover:text-blue-400 transition">Lainnya</Link>
          <Link href="/pembayaran" className="hover:text-blue-400 transition">Pembayaran</Link>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-900/20 font-medium text-white hover:text-blue-400 transition"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-500 transition"
          >
            Daftar
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white text-3xl cursor-pointer"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* smoother mobile dropdown */}
      <div
        className={`lg:hidden flex flex-col absolute right-4 top-20 min-w-[180px] bg-black/90 border border-gray-700 rounded-lg shadow-lg px-3 py-4 space-y-3 z-[1000] transform origin-top-right transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link href="/" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Home</Link>
        <Link href="/kursus" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Kursus</Link>
        <Link href="/lainnya" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Lainnya</Link>
        <Link href="/pembayaran" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Pembayaran</Link>
        <Link href="/login" className="border border-blue-500 hover:bg-blue-900/20 hover:text-blue-400 rounded-md px-3 py-1 transition">Masuk</Link>
        <Link href="/register" className="bg-blue-700 hover:bg-blue-500 rounded-md px-3 py-1 transition">Daftar</Link>
      </div>
    </header>
  );
}
