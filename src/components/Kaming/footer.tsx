"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Footer() {
  const path = usePathname();
  const isPageForbid = path.startsWith("/auth");

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userRole = (session?.user as { role?: string })?.role;

    const dashboardPath =
        userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
    const pembayaranPath =
        userRole === "admin" ? "/admin/pembayaran" : "/user/pembayaran";
    const produkPath = 
        userRole === "admin" ? "/admin/produk" : "/produk";

  if (isPageForbid) return null;

  return (
    <footer className="w-[90%] lg:w-[80%] mx-auto mt-20 mb-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
        {/* Kiri - Logo dan ucapan */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/Logo/TrainityFullWhite.svg"
              alt="Trainity Logo"
              width={150}
              height={40}
              className="select-none"
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Terima kasih telah berkunjung ke situs kami.{" "}
            Semoga pengalaman Anda di Trainity membawa inspirasi baru untuk
            terus belajar.
          </p>
        </div>

        {/* Tengah - Navigasi */}
        <div>
          <h3 className="text-white font-semibold mb-3">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href={produkPath} className="hover:text-blue-400 transition">
                Produk
              </Link>
            </li>
            <li>
              <Link href="/panduan" className="hover:text-blue-400 transition">
                Panduan
              </Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-blue-400 transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="hover:text-blue-400 transition"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href={dashboardPath}
                    className="hover:text-blue-400 transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href={pembayaranPath}
                    className="hover:text-blue-400 transition"
                  >
                    Pembayaran
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Kanan - Tentang dan Kontak */}
        <div>
          <h3 className="text-white font-semibold mb-3">Tentang Kami</h3>
          <p className="text-sm leading-relaxed mb-4 text-gray-400">
            Trainity adalah platform belajar coding modern yang membantu
            generasi muda Indonesia menguasai dunia teknologi dengan cara yang
            menyenangkan dan praktis.
          </p>
          <h3 className="text-white font-semibold mb-2">Kontak</h3>
          <p className="text-sm">
            Email:{" "}
            <Link
              href="mailto:info@trainity.com"
              className="hover:text-blue-400 transition"
            >
              info@trainity.com
            </Link>
            <br />
            Phone: <span className="text-gray-300">+62 838-3536-0789</span>
          </p>
          <div className="flex gap-4 mt-4 text-gray-400">
            <Link
              href="https://github.com/KamingLo/TrainityNext"
              className="hover:text-blue-400 transition"
            >
              <i className="bx bxl-github text-2xl"></i>
            </Link>
            <Link
              href="https://instagram.com/kaminglo_"
              className="hover:text-blue-400 transition"
            >
              <i className="bx bxl-instagram text-2xl"></i>
            </Link>
            <Link
              href="https://linkedin.com/in/kaming-lo"
              className="hover:text-blue-400 transition"
            >
              <i className="bx bxl-linkedin-square text-2xl"></i>
            </Link>
            <Link
              href="https://wa.me/6281234567890"
              className="hover:text-blue-400 transition"
            >
              <i className="bx bxl-whatsapp text-2xl"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Bawah - Copyright */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400 bg-black/30 backdrop-blur-sm rounded-b-2xl">
        © {new Date().getFullYear()}{" "}
        <span className="text-gray-200">Trainity</span>. All rights reserved.
      </div>
    </footer>
  );
}
