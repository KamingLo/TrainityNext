"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/kaming/backbutton";
import styles from "@/styles/kaming/auth.module.css"; // Impor
import Section from "@/components/sections";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
            {[
              {
                id: "username",
                type: "text",
                label: "Username",
                value: username,
                setter: setUsername,
                placeholder: "Masukkan username",
              },
              {
                id: "email",
                type: "email",
                label: "Email",
                value: email,
                setter: setEmail,
                placeholder: "nama@contoh.com",
              },
              {
                id: "password",
                type: "password",
                label: "Password",
                value: password,
                setter: setPassword,
                placeholder: "Minimal 8 karakter",
              },
              {
                id: "confirm",
                type: "password",
                label: "Konfirmasi Password",
                value: confirm,
                setter: setConfirm,
                placeholder: "Ulangi password",
              },
            ].map(({ id, type, label, value, setter, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className={styles.formLabel}>
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className={styles.loginInput}
                />
              </div>
            ))}
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