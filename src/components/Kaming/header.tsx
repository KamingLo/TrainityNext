"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

// DIUBAH: Impor dari common.module.css
import styles from "@/styles/kaming/common.module.css";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const userRole = (session?.user as { role?: string })?.role;
  const dashboardPath =
    userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
  const pembayaranPath =
    userRole === "admin" ? "/admin/pembayaran" : "/user/pembayaran";
  const produkPath = userRole === "admin" ? "/admin/produk" : "/produk";

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/Logo/TrainityFullWhite.svg"
            alt="Logo"
            width={160}
            height={40}
            className={styles.logoImage}
          />
        </Link>

        {/* Menu utama (desktop) */}
        <div className={styles.menuDesktop}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href={produkPath} className={styles.navLink}>
            Produk
          </Link>
          <Link href="/panduan" className={styles.navLink}>
            Panduan
          </Link>
          {isLoggedIn && (
            <Link href={pembayaranPath} className={styles.navLink}>
              Pembayaran
            </Link>
          )}
        </div>

        {/* Aksi kanan (desktop) */}
        <div className={styles.actionsDesktop}>
          {!isLoggedIn ? (
            <>
              <Link href="/auth/login" className={styles.buttonOutline}>
                Masuk
              </Link>
              <Link href="/auth/register" className={styles.buttonPrimary}>
                Daftar
              </Link>
            </>
          ) : (
            <>
              <Link href={dashboardPath} className={styles.buttonOutline}>
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={styles.buttonLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Tombol menu (mobile) */}
        <button onClick={() => setIsOpen(!isOpen)} className={styles.menuToggle}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Menu mobile dengan animasi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={styles.menuMobileContainer}
          >
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={styles.menuMobileLink}
            >
              Home
            </Link>
            <Link
              href={produkPath}
              onClick={() => setIsOpen(false)}
              className={styles.menuMobileLink}
            >
              Produk
            </Link>
            <Link
              href="/panduan"
              onClick={() => setIsOpen(false)}
              className={styles.menuMobileLink}
            >
              Panduan
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href={pembayaranPath}
                  onClick={() => setIsOpen(false)}
                  className={styles.menuMobileLink}
                >
                  Pembayaran
                </Link>
                <Link
                  href={dashboardPath}
                  onClick={() => setIsOpen(false)}
                  className={styles.menuMobileLink}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className={styles.menuMobileLogout}
                >
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className={styles.menuMobileLogin}
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className={styles.menuMobileRegister}
                >
                  Daftar
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}