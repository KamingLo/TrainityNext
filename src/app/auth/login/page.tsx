"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/kaming/backbutton";
import Section from "@/components/sections";
import styles from "@/styles/kaming/auth.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res?.error);
    } else {
      setSuccess("Segera redirect ke halaman dashboard");

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (sessionData?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  };

  return (
    <Section>
      <div className={styles.loginContainer}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <BackButton />
          <h2 className={styles.loginTitle}>Sign In</h2>

          <div className={styles.formInputsContainer}>
            <div>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className={styles.loginInput}
              />
            </div>

            <div className={styles.passwordWrapper}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className={styles.loginInput}
              />

              <i
                className={`bx ${
                  showPassword ? "bx-hide" : "bx-show"
                } ${styles.passwordIcon}`}
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>

              <div className={styles.textRight}>
                <Link href="/auth/forgot-password" className={styles.linkSubtle}>
                  Lupa Password?
                </Link>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.loginSubmitButton}>
            Masuk
          </button>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}

          <p className={styles.loginRedirectText}>
            Belum punya akun?{" "}
            <a href="/auth/register" className={styles.loginRedirectLink}>
              Daftar di sini
            </a>
          </p>
        </form>
      </div>
    </Section>
  );
}
