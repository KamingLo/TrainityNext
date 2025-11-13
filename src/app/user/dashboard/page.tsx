"use client";

import { useEffect, useState } from "react";
import InProgressCourseCard from "@/components/fabio/InProgressCourseCard";
import RecommendedCourseCard from "@/components/fabio/RecommendedCourseCard";
import NoCourseCard from "@/components/fabio/NoCourseCard";

const useMockSession = () => ({
  data: { user: { name: "Fabio", email: "fabio@trainity.com" } },
  status: "authenticated",
});

const useMockRouter = () => ({
  push: (path: string) => alert(`Simulasi navigasi ke: ${path}`),
});

const useSession = useMockSession;
const useRouter = useMockRouter;

interface Course {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface InProgressCourse extends Course {
  progress: number;
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inProgressCourses, setInProgressCourses] = useState<InProgressCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    const coursesData: InProgressCourse[] = [
      {
        id: 1,
        title: "React untuk Pemula",
        progress: 30,
        category: "Frontend",
        imageUrl: "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "JavaScript Fundamentals",
        progress: 75,
        category: "Programming",
        imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
      },
    ];

    const recommendedData: Course[] = [
      {
        id: 3,
        title: "Node.js & Express",
        category: "Backend",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        title: "UI/UX Design with Figma",
        category: "Desain",
        imageUrl: "https://images.unsplash.com/photo-1607083205563-3eacb915b1c5?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 5,
        title: "Dasar-Dasar HTML & CSS",
        category: "Web Dasar",
        imageUrl: "https://images.unsplash.com/photo-1555066930-6e0b7d37e8a1?auto=format&fit=crop&w=800&q=80",
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

  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 pt-40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            Selamat datang, <span className="text-blue-400">{user?.name}</span>!
          </h1>
          <p className="text-gray-400">
            Teruskan progres Anda dan capai tujuan belajar Anda.
          </p>
        </div>

        <div className="w-full space-y-12">
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
