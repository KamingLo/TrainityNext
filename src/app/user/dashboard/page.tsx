"use client";

// 'useSession' dan 'useRouter' telah disimulasikan di bawah
// karena tidak tersedia di lingkungan pratinjau ini.
// Hapus/Komentari import asli saat menggunakan simulasi
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// Impor ikon dari lucide-react
import {
  Play,
  Award,
  Search,
  BookOpen,
} from "lucide-react";

// --- SIMULASI/MOCK UNTUK LINGKUNGAN INI ---
// Di proyek Next.js Anda, Anda akan menggunakan import asli
const useMockSession = () => ({
  data: { user: { name: "Fabio", email: "fabio@trainity.com" } },
  status: "authenticated",
});
const useMockRouter = () => ({
  push: (path: string) => alert(`Simulasi navigasi ke: ${path}`),
});
const useSession = useMockSession;
const useRouter = useMockRouter;
// --- AKHIR DARI SIMULASI ---

// --- INTERFACE DATA ---
interface Course {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface InProgressCourse extends Course {
  progress: number;
}

// --- KOMPONEN UTAMA ---
export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inProgressCourses, setInProgressCourses] = useState<
    InProgressCourse[]
  >([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    // === SIMULASI DATA BACKEND-FRIENDLY ===
    // Backend hanya mengambil kursus aktif (LIMIT 4)
    // dan kursus rekomendasi (LIMIT 3)
    
    const coursesData: InProgressCourse[] = [
      {
        id: 1,
        title: "React untuk Pemula",
        progress: 30,
        category: "Frontend",
        imageUrl: "https://placehold.co/600x400/3B82F6/FFFFFF?text=React",
      },
      {
        id: 2,
        title: "JavaScript Fundamentals",
        progress: 75,
        category: "Programming",
        imageUrl: "https://placehold.co/600x400/F59E0B/FFFFFF?text=JavaScript",
      },
    ];

    const recommendedData: Course[] = [
      {
        id: 3,
        title: "Node.js & Express",
        category: "Backend",
        imageUrl: "https://placehold.co/600x400/10B981/FFFFFF?text=Node.js",
      },
      {
        id: 4,
        title: "UI/UX Design with Figma",
        category: "Desain",
        imageUrl: "https://placehold.co/600x400/8B5CF6/FFFFFF?text=Figma",
      },
      {
        id: 5,
        title: "Dasar-Dasar HTML & CSS",
        category: "Web Dasar",
        imageUrl: "https://placehold.co/600x400/EF4444/FFFFFF?text=HTML/CSS",
      },
    ];

    setInProgressCourses(coursesData);
    setRecommendedCourses(recommendedData);
    setLoading(false);
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Memuat dashboard...
      </div>
    );
  }

  const user: { name?: string; email?: string } | undefined = session?.user;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 pt-40"> {/* pt-40 untuk memberi ruang di bawah header fixed */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            Selamat datang,{" "}
            <span className="text-blue-400">{user?.name}</span>!
          </h1>
          <p className="text-gray-400">
            Teruskan progres Anda dan capai tujuan belajar Anda.
          </p>
        </div>

        {/* Layout Utama (Satu Kolom) */}
        <div className="w-full space-y-12">
          
          {/* Bagian: Kursus Sedang Berjalan */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Kursus Sedang Berjalan</h2>
            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inProgressCourses.map((course) => (
                  <InProgressCourseCard 
                    key={course.id} 
                    course={course} 
                    router={router} 
                  />
                ))}
              </div>
            ) : (
              <NoCourseCard router={router} />
            )}
          </section>

          {/* Bagian: Rekomendasi Kursus */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Rekomendasi Untuk Anda</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <RecommendedCourseCard 
                  key={course.id} 
                  course={course} 
                  router={router} 
                />
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN PENDUKUNG ---

/**
 * Kartu untuk menampilkan kursus yang sedang berjalan (dengan progress bar)
 */
function InProgressCourseCard({ course, router }: { course: InProgressCourse, router: any }) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-5">
        <span className="text-xs font-medium text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full">
          {course.category}
        </span>
        <h3 className="font-semibold text-lg text-white my-3">
          {course.title}
        </h3>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progres</span>
            <span className="font-semibold text-blue-400">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
        
        <button
          onClick={() => router.push(`/kursus/${course.id}`)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium"
        >
          <Play className="w-5 h-5" />
          Lanjutkan
        </button>
      </div>
    </div>
  );
}

/**
 * Kartu untuk menampilkan kursus yang direkomendasikan (tanpa progress bar)
 */
function RecommendedCourseCard({ course, router }: { course: Course, router: any }) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-gray-700/20 hover:-translate-y-1">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-32 object-cover"
      />
      <div className="p-5">
        <span className="text-xs font-medium text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
          {course.category}
        </span>
        <h3 className="font-semibold text-base text-white my-3">
          {course.title}
        </h3>
        <button
          onClick={() => router.push(`/kursus/${course.id}`)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          <BookOpen className="w-4 h-4" />
          Lihat Detail
        </button>
      </div>
    </div>
  );
}


/**
 * Kartu placeholder jika tidak ada kursus
 */
function NoCourseCard({ router }: { router: any }) {
  return (
    <div className="p-6 md:col-span-2 rounded-xl bg-gray-900 border border-gray-800 border-dashed flex flex-col items-center justify-center text-center h-full">
      <Search className="w-12 h-12 text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Anda Belum Memulai Kursus</h3>
      <p className="text-gray-400 mb-6">
        Cari kursus yang Anda minati untuk memulai perjalanan!
      </p>
      <button
        onClick={() => router.push("/kursus")}
        className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium"
      >
        Cari Kursus
      </button>
    </div>
  );
}