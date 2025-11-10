import React from 'react';
import { Play, Users } from 'lucide-react';

const VideoFeature = () => {
  return (
    <section className="py-20">
      {/* MODIFIKASI: Menggunakan lebar w-[90%] lg:w-[80%] */}
      <div className="w-[90%] lg:w-[80%] mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/30 border border-blue-500/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600" 
                alt="Video Learning" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-blue-600 ml-1" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Belajar Lebih Efektif Dengan Video
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">100+ Video Berkualitas</h3>
                    <p className="text-gray-400">Akses ratusan video yang telah dibuat untuk pemahaman konsep secara menyeluruh.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Diajar oleh Praktisi Ahli</h3>
                    <p className="text-gray-400">Materi diajarkan oleh praktisi ahli di bidangnya, memastikan relevansi dengan kebutuhan industri.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFeature;