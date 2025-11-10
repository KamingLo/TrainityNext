import React from 'react';

const PartnershipSection = () => {
  return (
    <section className="py-20">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block text-sm font-semibold text-blue-400 uppercase tracking-wide">
                Kolaborasi Spesial
              </span>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Kurikulum Didukung Penuh oleh Web Programming UNPAS
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Kami bangga dapat bekerja sama dengan Sandhika Galih dari Web Programming UNPAS. Kolaborasi ini memastikan bahwa kurikulum kami relevan, mendalam, dan sesuai dengan standar industri terbaik.
              </p>
              <button className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:border-gray-600 transition-all">
                Jelajahi Kurikulum
              </button>
            </div>

            <div className="flex justify-center">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-radial from-blue-500/25 via-blue-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500/20 shadow-2xl">
                  <img 
                    src="/homepage/sandhika.png" 
                    alt="Sandhika Galih"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;