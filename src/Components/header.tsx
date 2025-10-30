"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-black/80 backdrop-blur-md shadow-sm relative">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">

        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Logo/TrainityFullWhite.svg"
              alt="Logo"
              width={160}
              height={160}
              className="rounded-md"
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-white font-medium">
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
          <Link href="/kursus" className="hover:text-blue-500 transition">Kursus</Link>
          <Link href="/lainnya" className="hover:text-blue-500 transition">Lainnya</Link>
          <Link href="/pembayaran" className="hover:text-blue-500 transition">Pembayaran</Link>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 font-medium text-white hover:text-blue-500 transition"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
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

      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } lg:hidden flex-col absolute right-4 top-16 min-w-[180px] bg-black/90 border border-gray-700 rounded-lg shadow-lg px-3 py-4 space-y-3 z-[1000]`}
      >
        <Link
          href="/"
          className="hover:bg-white/20 rounded-md px-2 py-1 transition"
        >
          Home
        </Link>
        <Link
          href="/kursus"
          className="hover:bg-white/20 rounded-md px-2 py-1 transition"
        >
          Kursus
        </Link>
        <Link
          href="/lainnya"
          className="hover:bg-white/20 rounded-md px-2 py-1 transition"
        >
          Lainnya
        </Link>
        <Link
          href="/pembayaran"
          className="hover:bg-white/20 rounded-md px-2 py-1 transition"
        >
          Pembayaran
        </Link>

        <Link
          href="/login"
          className="border border-blue-500 hover:bg-blue-900/20 rounded-md px-3 py-1 transition"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="bg-blue-700 hover: rounded-md px-3 py-1 transition"
        >
          Register
        </Link>
      </div>
    </header>
  );
}
