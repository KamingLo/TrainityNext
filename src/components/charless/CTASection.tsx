import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4">
        <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 18c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6z' stroke='%23fff' stroke-opacity='.1'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Tunggu Apa Lagi?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Mulai perjalanan belajarmu di dunia digital bersama Trainity hari ini.
            </p>
            <a href="/auth/register" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all">
              Buat Akun Gratis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;