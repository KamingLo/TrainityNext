import React from 'react';
import { CheckCircle, Clock, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const advantages = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Kurikulum Terstruktur",
      description: "Materi disusun secara sistematis dari dasar hingga mahir, memastikan Anda belajar dengan alur yang jelas dan efektif."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Akses Kapan Saja",
      description: "Belajar sesuai dengan kecepatan dan jadwal Anda sendiri. Semua materi kursus dapat diakses selamanya tanpa batas waktu."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Diajar oleh Praktisi Ahli",
      description: "Belajar langsung dari profesional industri yang memiliki pengalaman nyata di bidangnya masing-masing."
    }
  ];

  return (
    <section id="mengapa" className="py-20">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mengapa Memilih Trainity?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Kami menyediakan platform terbaik untuk membantu Anda menjadi developer andal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                {advantage.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{advantage.title}</h3>
              <p className="text-gray-400 leading-relaxed">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;