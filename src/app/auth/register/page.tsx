"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/kaming/backbutton";
import styles from "@/styles/kaming/auth.module.css";
import Section from "@/components/sections";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- NEW: show/hide password ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirm }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan.");
    } else {
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => router.push("/auth/login"), 1500);
    }
  };

  return (
    <Section>
      <div className={styles.registerContainer}>
        <form onSubmit={handleRegister} className={styles.loginForm}>
          <BackButton />
          <h2 className={styles.loginTitle}>Sign Up</h2>

          <div className={styles.formInputsContainer}>
            {/* Username */}
            <div>
              <label className={styles.formLabel}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className={styles.loginInput}
              />
            </div>

            {/* Email */}
            <div>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@contoh.com"
                className={styles.loginInput}
              />
            </div>

            {/* Password */}
            <div className={styles.passwordWrapper}>
              <label className={styles.formLabel}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className={styles.loginInput}
              />

              <i
                className={`bx ${showPassword ? "bx-hide" : "bx-show"} ${styles.passwordIcon}`}
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            </div>

            {/* Confirm Password */}
            <div className={styles.passwordWrapper}>
              <label className={styles.formLabel}>Konfirmasi Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi password"
                className={styles.loginInput}
              />

              <i
                className={`bx ${showConfirm ? "bx-hide" : "bx-show"} ${styles.passwordIcon}`}
                onClick={() => setShowConfirm((prev) => !prev)}
              ></i>
            </div>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}

          <button type="submit" className={styles.loginSubmitButton}>
            Daftar Sekarang
          </button>

          <p className={styles.loginRedirectText}>
            Sudah punya akun?{" "}
            <a href="/auth/login" className={styles.loginRedirectLink}>
              Login di sini
            </a>
          </p>
        </form>
      </div>
    </Section>
  );
}
