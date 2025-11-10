import React from 'react';
import { Code, Server, Layers } from 'lucide-react';

const Categories = () => {
  const categories = [
    { icon: <Code className="w-8 h-8" />, name: "Front End Development" },
    { icon: <Server className="w-8 h-8" />, name: "Back End Development" },
    { icon: <Layers className="w-8 h-8" />, name: "Framework & Library" }
  ];

  return (
    <section className="py-20">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4">
        <div className="bg-gradient-to-br from-purple-950/30 to-blue-950/50 border border-purple-500/20 rounded-3xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Kategori Kursus yang Kami Sediakan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="group bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer text-center"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;