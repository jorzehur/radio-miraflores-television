'use client'

import { motion } from 'framer-motion'
import { Play, Radio } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

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
          {/* ON AIR Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600 rounded-full mb-6"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold tracking-widest">EN VIVO</span>
          </motion.div>

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
            {/* Play Button */}
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              className="group flex items-center gap-3 px-8 py-4 bg-white rounded-full text-[#8B1A2B] font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <>
                  <Radio className="w-5 h-5 group-hover:animate-spin" />
                  Escuchando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Escuchar en Vivo
                </>
              )}
            </motion.button>

            <a
              href="#ranking"
              className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Ver Ranking
            </a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-3 bg-white/60 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Video Thumbnail Overlay - Simulated Video */}
      <div className="absolute bottom-0 left-0 right-0 z-[2]">
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto group cursor-pointer"
          >
            <Image
              src="/images/hero-video-thumb.png"
              alt="Programa en vivo"
              width={1344}
              height={768}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#8B1A2B] fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">EN VIVO</span>
              <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">Programa de la Mañana</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
