"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// DIUBAH: Impor dari common.module.css
import styles from "@/styles/kaming/common.module.css";

export default function Footer() {
  const path = usePathname();
  const isPageForbid = path.startsWith("/auth");

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userRole = (session?.user as { role?: string })?.role;

  const dashboardPath =
    userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
  const pembelianPath = "/admin/pembelian";

  if (isPageForbid) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <div className={styles.footerLogoContainer}>
            <Image
              src="/Logo/TrainityFullWhite.svg"
              alt="Trainity Logo"
              width={150}
              height={40}
              className={styles.footerLogoImage}
            />
          </div>
          <p className={styles.footerText}>
            Terima kasih telah berkunjung ke situs kami. Semoga pengalaman Anda
            di Trainity membawa inspirasi baru untuk terus belajar.
          </p>
        </div>

        <div>
          <h3 className={styles.footerHeading}>Navigasi</h3>
          <ul className={styles.footerNavList}>
            <li>
              <Link href="/" className={styles.footerLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href={"/produk"} className={styles.footerLink}>
                Produk
              </Link>
            </li>
            <li>
              <Link href="/panduan" className={styles.footerLink}>
                Panduan
              </Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li>
                  <Link href="/auth/login" className={styles.footerLink}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className={styles.footerLink}>
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={dashboardPath} className={styles.footerLink}>
                    Dashboard
                  </Link>
                </li>
                <li>
                {userRole === "admin" && (
                  <Link href={pembelianPath} className={styles.footerLink}>
                    Pembelian
                  </Link>
                )}
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h3 className={styles.footerHeading}>Tentang Kami</h3>
          <p className={styles.footerTextAbout}>
            Trainity adalah platform belajar coding modern yang membantu generasi
            muda Indonesia menguasai dunia teknologi dengan cara yang
            menyenangkan dan praktis.
          </p>
          <h3 className={styles.footerHeadingContact}>Kontak</h3>
          <p className={styles.footerContactText}>
            Email:{" "}
            <Link href="mailto:info@trainity.com" className={styles.footerLink}>
              info@trainity.com
            </Link>
            <br />
            Phone: <span className={styles.footerPhone}>+62 838-3536-0789</span>
          </p>
          <div className={styles.socialsContainer}>
            <Link
              href="https://github.com/KamingLo/TrainityNext"
              className={styles.footerLink}
            >
              <i className={`bx bxl-github ${styles.socialIcon}`}></i>
            </Link>
            <Link
              href="https://instagram.com/kaminglo_"
              className={styles.footerLink}
            >
              <i className={`bx bxl-instagram ${styles.socialIcon}`}></i>
            </Link>
            <Link
              href="https://linkedin.com/in/kaming-lo"
              className={styles.footerLink}
            >
              <i className={`bx bxl-linkedin-square ${styles.socialIcon}`}></i>
            </Link>
            <Link
              href="https://wa.me/6281234567890"
              className={styles.footerLink}
            >
              <i className={`bx bxl-whatsapp ${styles.socialIcon}`}></i>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.footerCopyright}>
        © {new Date().getFullYear()}{" "}
        <span className={styles.footerCopyrightHighlight}>Trainity</span>. All
        rights reserved.
      </div>
    </footer>
  );
}