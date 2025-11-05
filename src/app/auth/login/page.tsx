"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Section from "@/components/sections";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            if (sessionData?.user?.role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/user/dashboard"); 
            }
    }
  };

  return (
    <Section>
        <form
          onSubmit={handleLogin}
          className="bg-black/60 backdrop-blur-xl border border-gray-800 w-full max-w-md p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white text-transparent bg-clip-text">
            Sign In
          </h2>

          <div className="space-y-4">
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
                placeholder="Masukkan email"
                className="w-full px-4 py-2 bg-black/60 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-2 bg-black/60 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              />
              <div className="text-right">
                <Link href={`/auth/forget-password`} className="text-sm text-blue-500 hover:text-blue-300 transition-all">Lupa Password?</Link>
              </div>
            </div>
          </div>


          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-blue-700/50"
            >
            Masuk
          </button>

            {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}

          <p className="text-sm text-center text-gray-400 mt-4">
            Belum punya akun?{" "}
            <a
              href="/auth/register"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Daftar di sini
            </a>
          </p>
        </form>
    </Section>
  );
}