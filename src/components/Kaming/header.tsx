"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  
  return (
    <header className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] lg:w-[80%] bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-lg z-50">
      <nav className="flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo/TrainityFullWhite.svg"
            alt="Logo"
            width={160}
            height={160}
            className="rounded-md"
          />
        </Link>

        {/* Menu utama (desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-white font-medium">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <Link href="/kursus" className="hover:text-blue-400 transition">Kursus</Link>
          <Link href="/panduan" className="hover:text-blue-400 transition">Panduan</Link>
          {isLoggedIn && (
            <Link href="/pembayaran" className="hover:text-blue-400 transition">Pembayaran</Link>
          )}
        </div>

        {/* Aksi kanan (desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-900/20 font-medium text-white hover:text-blue-400 transition"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-500 transition"
              >
                Daftar
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-900/20 font-medium text-white hover:text-blue-400 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white text-3xl cursor-pointer"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <div
        className={`lg:hidden flex flex-col fixed right-4 top-20 min-w-[180px] bg-black/90 border border-gray-700 rounded-lg shadow-lg px-3 py-4 space-y-3 transform origin-top-right transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2"
        }`}
      >
        <Link href="/" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Home</Link>
        <Link href="/kursus" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Kursus</Link>
        <Link href="/panduan" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Panduan</Link>
        {isLoggedIn && (
          <>
            <Link href="/pembayaran" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Pembayaran</Link>
            <Link href="/dashboard" className="hover:bg-white/20 rounded-md px-2 py-1 transition">Dashboard</Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-left border border-red-600 hover:bg-red-800/30 rounded-md px-3 py-1 transition text-red-400"
            >
              Logout
            </button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link href="/auth/login" className="border border-blue-500 hover:bg-blue-900/20 hover:text-blue-400 rounded-md px-3 py-1 transition">Masuk</Link>
            <Link href="/auth/register" className="bg-blue-700 hover:bg-blue-500 rounded-md px-3 py-1 transition">Daftar</Link>
          </>
        )}
      </div>
    </header>
  );
}
