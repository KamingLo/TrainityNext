import React from 'react';
import { Star } from 'lucide-react';

// Mock data untuk kursus
const featuredCourses = [
  {
    id: 1,
    title: "HTML & CSS Fundamental",
    description: "Pelajari dasar-dasar web development dari nol hingga mahir",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
    level: "Pemula",
    rating: 4.8
  },
  {
    id: 2,
    title: "JavaScript Modern",
    description: "Master JavaScript ES6+ untuk pengembangan web modern",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500",
    level: "Menengah",
    rating: 4.9
  },
  {
    id: 3,
    title: "React untuk Pemula",
    description: "Bangun aplikasi web interaktif dengan React.js",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    level: "Menengah",
    rating: 4.7
  }
];

const FeaturedCourses = () => {
  return (
    <section id="kursus" className="py-20">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kursus Unggulan
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div 
              key={course.id}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-video">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"                
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-400">{course.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm">
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
            Lihat Semua Kursus
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;