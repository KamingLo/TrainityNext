"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  return(
    <>
        <div className="mt-8 min-h-screen flex items-center justify-center">
            <form
            onSubmit={handleRegister}
            className="bg-black/60 backdrop-blur-xl border border-gray-800 w-full max-w-md p-8 rounded-2xl shadow-2xl"
            >

            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r text-white text-transparent bg-clip-text">
                Sign Up
            </h2>

            <div className="space-y-4">
                {[
                    { id: 'username', type: 'text', label: 'Username', value: username, 
                    setter: setUsername, placeholder: 'Masukkan username' },
                    { id: 'email', type: 'email', label: 'Email', value: email, 
                    setter: setEmail, placeholder: 'nama@contoh.com' },
                    { id: 'password', type: 'password', label: 'Password', value: password, 
                    setter: setPassword, placeholder: 'Minimal 8 karakter' },
                    { id: 'confirm', type: 'password', label: 'Konfirmasi Password', value: confirm, 
                    setter: setConfirm, placeholder: 'Ulangi password' }
                ].map(({ id, type, label, value, setter, placeholder }) => (
                    <div key={id}>
                        <label
                            htmlFor={id}
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            {label}
                        </label>
                        <input
                            id={id}
                            type={type}
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-4 py-2 bg-black/60 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                ))}
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-500 text-sm mt-3 text-center">{success}</p>
            )}

            <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-blue-700/50"
            >
                Daftar Sekarang
            </button>

            <p className="text-sm text-center text-gray-400 mt-4">
                Sudah punya akun?{" "}
                <a
                href="/auth/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
                >
                Login di sini
                </a>
            </p>
            </form>
        </div>
    </>
  );
}
