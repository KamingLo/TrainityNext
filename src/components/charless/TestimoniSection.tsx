import React from 'react';

const testimonials = [
  {
    name: "Fabio",
    institution: "Universitas Indonesia",
    quote: "Trainity menawarkan pengalaman belajar mendalam tanpa biaya. Pengetahuan dari sini memperkuat ilmu fundamental saya dan sangat berkontribusi pada portofolio profesional yang tengah saya bangun untuk karier di dunia teknologi."
  },
  {
    name: "Joe",
    institution: "Universitas Pelita Harapan",
    quote: "Materi yang diajarkan sangat relevan dan mudah dimengerti karena fokus pada konsep dan disertai video yang membantu. Pengajarnya jelas memiliki skill berkelas!"
  },
  {
    name: "Michael",
    institution: "Universitas Trisakti",
    quote: "Skills yang saya peroleh dari Trainity membuat saya berani melamar ke salah satu startup ternama. Akhirnya, saya berhasil diterima sebagai Junior Web Developer!"
  },
  {
    name: "Kaming",
    institution: "Universitas Tarumanagara",
    quote: "Platform ini sangat membantu profesional berpengalaman seperti saya untuk memperbarui keterampilan dengan teknologi dan framework web terbaru."
  },
  {
    name: "Charless",
    institution: "Institut Teknologi Surabaya",
    quote: "Konsep-konsep pemrograman di Trainity sangat mudah dipahami dan terapkan. Sulit menemukan penjelasan sebagus ini di tempat lain, bahkan di kampus sekalipun."
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 overflow-hidden">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
          Kata Mereka yang Belajar Bersama Kami
        </h2>
      </div>

      <div className="relative">
        <div className="flex gap-6 animate-scroll">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-96 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.institution}</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;