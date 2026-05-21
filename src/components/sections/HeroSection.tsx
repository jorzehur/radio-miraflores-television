'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeroData {
  id: string
  title: string
  titleHighlight: string
  subtitle: string
  ctaPrimaryText: string
  ctaPrimaryLink: string
  ctaSecondaryText: string
  ctaSecondaryLink: string
  backgroundImage: string
  overlayColor: string
  updatedAt: string
}

const defaultHero: HeroData = {
  id: 'default',
  title: 'Radio',
  titleHighlight: 'Miraflores',
  subtitle: 'La estación de rock que mueve tu mundo',
  ctaPrimaryText: 'Ver Ranking',
  ctaPrimaryLink: '#ranking',
  ctaSecondaryText: 'Últimas Noticias',
  ctaSecondaryLink: '#noticias',
  backgroundImage: '/images/hero-radio-studio.png',
  overlayColor: 'from-[#B3E5FC]/85 via-[#81D4FA]/75 to-[#4FC3F7]/90',
  updatedAt: '',
}

export default function HeroSection() {
  const [hero, setHero] = useState<HeroData>(defaultHero)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchHero() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch('/api/public/hero', {
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (!isMounted) return
        if (data && data.title) {
          setHero(data)
        }
      } catch {
        // Keep fallback data
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchHero()
    return () => { isMounted = false }
  }, [])

  // Parse overlay color classes
  const overlayClasses = hero.overlayColor || defaultHero.overlayColor

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.backgroundImage || defaultHero.backgroundImage}
          alt="Radio Miraflores Televisión - Estudio"
          fill
          className="object-cover"
          priority
        />
        {/* Celeste Claro Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b ${overlayClasses}`} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0288D1]/20 to-transparent" />
      </div>

      {/* Animated Sound Waves */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
            style={{ width: 200 + i * 150, height: 200 + i * 150 }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.3, 0.15],
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
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            {hero.title}{' '}
            <span className="bg-gradient-to-r from-[#8B1A2B] to-[#A63346] bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
            <br />
            Televisión
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            {hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={hero.ctaPrimaryLink || '#ranking'}
              className="flex items-center gap-2 px-8 py-4 bg-[#8B1A2B] rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-[#8B1A2B]/40 transition-all duration-300 hover:scale-105"
            >
              {hero.ctaPrimaryText}
            </a>

            <a
              href={hero.ctaSecondaryLink || '#noticias'}
              className="flex items-center gap-2 px-8 py-4 border-2 border-white/50 text-white rounded-full font-semibold text-lg hover:bg-white/15 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              {hero.ctaSecondaryText}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
