"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  const user = session?.user as { name?: string; role?: string };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mb-6">
          Welcome back, <span className="text-blue-400">{user?.name}</span>!
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <h2 className="font-medium text-lg mb-2">User Management</h2>
            <p className="text-sm text-gray-400">
              View and manage registered users.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <h2 className="font-medium text-lg mb-2">Reports</h2>
            <p className="text-sm text-gray-400">
              Check performance and system insights.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <h2 className="font-medium text-lg mb-2">Settings</h2>
            <p className="text-sm text-gray-400">
              Configure roles, permissions, and app settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
