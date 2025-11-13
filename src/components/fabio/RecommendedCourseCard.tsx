"use client";

import { BookOpen } from "lucide-react";

interface Course {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface RouterLike {
  push: (url: string) => void;
}

interface RecommendedCourseCardProps {
  course: Course;
  router: RouterLike;
}

export default function RecommendedCourseCard({
  course,
  router,
}: RecommendedCourseCardProps) {
  return (
    <div className="rounded-xl bg-black/30 border border-gray-800 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-gray-700/20 hover:-translate-y-1 backdrop-blur-sm">
      <div className="relative w-full h-32">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-32 object-cover"
        />
      </div>

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
          <BookOpen className="w-4 h-4" /> Lihat Detail
        </button>
      </div>
    </div>
  );
}
