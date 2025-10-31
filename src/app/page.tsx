import Section from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Section id="hero" className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di Trainity</h1>
        <p className="text-gray-400 text-lg">
          Belajar skill digital modern dengan cara paling efisien.
        </p>
      </Section>

      <Section id="kursus" bg="bg-black/30" className="rounded-2xl backdrop-blur-md">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">Kursus Unggulan</h2>
      </Section>

      <Section id="about">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4">Tentang Kami</h2>
            <p className="text-gray-400 leading-relaxed">
              Trainity adalah platform belajar coding modern dengan pendekatan praktikal.
            </p>
          </div>
          <img src="/images/about.svg" alt="About" className="rounded-xl" />
        </div>
      </Section>
    </>
  );
}
