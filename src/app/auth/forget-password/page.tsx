"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Section from "@/components/sections";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (!email || !password || !confirmPassword) {
      setError("Harap isi semua field");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          newPassword: password,
          confirmPassword 
        }),
      });

      if (res.ok) {
        setMessage("Password berhasil direset! Mengarahkan ke login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Gagal reset password");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <div className="mt-8 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-black/60 backdrop-blur-xl border border-gray-800 w-full max-w-md p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white text-transparent bg-clip-text">
            Reset Password
          </h2>

          <p className="text-gray-400 text-center mb-6 text-sm">
            Masukkan email dan password baru Anda
          </p>

          {/* Success Message */}
          {message && (
            <div className="bg-green-900/50 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6 text-center text-sm">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6 text-center text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-2 bg-black/60 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* New Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password Baru
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="w-full px-4 py-2 bg-black/60 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Konfirmasi Password Baru
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password baru"
                className="w-full px-4 py-2 bg-black/60 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-green-700/50 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Meriset Password..." : "Reset Password"}
          </button>

          <div className="text-center mt-4">
            <Link 
              href="/auth/login" 
              className="text-blue-400 hover:text-blue-300 text-sm transition-all"
            >
              ← Kembali ke Login
            </Link>
          </div>
        </form>
      </div>
    </Section>
  );
}