"use client";

import { Play } from "lucide-react";

interface Course {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

interface InProgressCourse extends Course {
  progress: number;
}

interface RouterLike {
  push: (url: string) => void;
}

interface InProgressCourseCardProps {
  course: InProgressCourse;
  router: RouterLike;
}

export default function InProgressCourseCard({
  course,
  router,
}: InProgressCourseCardProps) {
  return (
    <div className="rounded-xl bg-black/30 border border-gray-800 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1 backdrop-blur-sm">
      <div className="relative w-full h-40">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
      </div>

      <div className="p-5">
        <span className="text-xs font-medium text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full">
          {course.category}
        </span>

        <h3 className="font-semibold text-lg text-white my-3">{course.title}</h3>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progres</span>
            <span className="font-semibold text-blue-400">
              {course.progress}%
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => router.push(`/kursus/${course.id}`)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium"
        >
          <Play className="w-5 h-5" /> Lanjutkan
        </button>
      </div>
    </div>
  );
}
