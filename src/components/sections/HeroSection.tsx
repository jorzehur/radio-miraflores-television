'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-radio-studio.png"
          alt="Radio Miraflores Televisión - Estudio"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B1A2B]/80 via-[#8B1A2B]/60 to-[#8B1A2B]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      {/* Animated Sound Waves */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
            style={{ width: 200 + i * 150, height: 200 + i * 150 }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
            Radio{' '}
            <span className="bg-gradient-to-r from-[#FFD166] to-[#F5A623] bg-clip-text text-transparent">
              Miraflores
            </span>
            <br />
            Televisión
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            La estación de rock que mueve tu mundo 🎸🔥
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#ranking"
              className="flex items-center gap-2 px-8 py-4 bg-white rounded-full text-[#8B1A2B] font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
            >
              Ver Ranking
            </a>

            <a
              href="#noticias"
              className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Últimas Noticias
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
