import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 lg:pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="w-[90%] lg:w-[80%] mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
              <Terminal className="w-4 h-4" />
              <span>Platform Belajar Coding Terbaik</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Belajar Gratis,
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Mudah Dipahami</span>
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed">
              Akses kursus gratis dengan materi berkualitas tinggi, dirancang untuk membekali kamu keterampilan masa depan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#kursus" className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2">
                Mulai Belajar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#kursus" className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center">
                Jelajahi Kursus
              </a>
            </div>

            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-gray-400">Video Pembelajaran</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-gray-400">Siswa Aktif</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-gray-400">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800" 
                alt="Coding" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;