"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Impor ikon dari lucide-react untuk menggantikan emoticon
import {
  CheckCircle,
  BookOpen,
  BarChart3,
  Play,
  Award,
  Zap,
  Settings,
  ClipboardCheck,
} from "lucide-react";

// Definisikan interface untuk data kursus
interface Course {
  id: number;
  title: string;
  progress: number;
  duration: string;
  status: "completed" | "in-progress" | "not-started";
  category: string;
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Arahkan pengguna jika tidak terautentikasi
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    // Simulasi pengambilan data kursus
    const coursesData: Course[] = [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        progress: 75,
        duration: "8 jam",
        status: "in-progress",
        category: "Programming",
      },
      {
        id: 2,
        title: "React untuk Pemula",
        progress: 30,
        duration: "12 jam",
        status: "in-progress",
        category: "Frontend",
      },
      {
        id: 3,
        title: "HTML & CSS Dasar",
        progress: 100,
        duration: "6 jam",
        status: "completed",
        category: "Web Development",
      },
      {
        id: 4,
        title: "Node.js Backend",
        progress: 0,
        duration: "10 jam",
        status: "not-started",
        category: "Backend",
      },
    ];

    setCourses(coursesData);
    setLoading(false);
  }, []);

  // Tampilkan loading state
  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Memuat dashboard...
      </div>
    );
  }

    const user = session?.user;

  // Kalkulasi statistik
  const completedCourses = courses.filter(
    (course) => course.status === "completed"
  ).length;
  const inProgressCourses = courses.filter(
    (course) => course.status === "in-progress"
  ).length;
  const totalProgress =
    courses.length > 0
      ? courses.reduce((acc, course) => acc + course.progress, 0) /
        courses.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Selamat datang kembali,{" "}
            <span className="text-blue-400 font-medium">{user?.name}</span>!
            Siap melanjutkan perjalanan belajar Anda?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat Card: Kursus Selesai */}
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Kursus Selesai
                </h3>
                <p className="text-2xl font-bold text-green-400">
                  {completedCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Stat Card: Sedang Dipelajari */}
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Sedang Dipelajari
                </h3>
                <p className="text-2xl font-bold text-blue-400">
                  {inProgressCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Stat Card: Rata-rata Progress */}
          <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">
                  Rata-rata Progress
                </h3>
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round(totalProgress)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Progress */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Progress Kursus</h2>
                <button
                  onClick={() => router.push("/kursus")}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Lihat Semua Kursus
                </button>
              </div>

              <div className="space-y-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            course.status === "completed"
                              ? "bg-green-400/20 text-green-400"
                              : course.status === "in-progress"
                              ? "bg-blue-400/20 text-blue-400"
                              : "bg-gray-400/20 text-gray-400"
                          }`}
                        >
                          {course.status === "completed"
                            ? "Selesai"
                            : course.status === "in-progress"
                            ? "Dalam Progress"
                            : "Belum Dimulai"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-24 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            course.status === "completed"
                              ? "bg-green-400"
                              : course.status === "in-progress"
                              ? "bg-blue-400"
                              : "bg-gray-500"
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span
                        className={`font-medium w-12 ${
                          course.status === "completed"
                            ? "text-green-400"
                            : course.status === "in-progress"
                            ? "text-blue-400"
                            : "text-gray-400"
                        }`}
                      >
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/kursus")}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors text-left"
                >
                  <Play className="w-5 h-5 text-blue-400" />
                  <span>Lanjutkan Belajar</span>
                </button>
                <button
                  onClick={() => router.push("/sertifikat")}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors text-left"
                >
                  <Award className="w-5 h-5 text-green-400" />
                  <span>Sertifikat Saya</span>
                </button>
                <button
                  onClick={() => router.push("/quiz")}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Edit Profil</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white">Menyelesaikan Quiz JavaScript</p>
                    <p className="text-gray-400 text-xs">2 jam yang lalu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white">Memulai Kursus React</p>
                    <p className="text-gray-400 text-xs">1 hari yang lalu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white">Mendapatkan Sertifikat HTML</p>
                    <p className="text-gray-400 text-xs">3 hari yang lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}