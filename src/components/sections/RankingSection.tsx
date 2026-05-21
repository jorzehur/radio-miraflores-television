'use client'

import { motion } from 'framer-motion'
import { Music, Trophy, TrendingUp, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

// Fallback data
const fallbackRanking = [
  { position: 1, song: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', weeks: 12, trend: 'up' },
  { position: 2, song: 'Hotel California', artist: 'Eagles', album: 'Hotel California', weeks: 8, trend: 'up' },
  { position: 3, song: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', weeks: 15, trend: 'same' },
  { position: 4, song: "Sweet Child O' Mine", artist: "Guns N' Roses", album: 'Appetite for Destruction', weeks: 6, trend: 'up' },
]

const cardStyles = [
  { color: 'from-yellow-400 to-amber-500', bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50', borderColor: 'border-yellow-200', icon: Trophy },
  { color: 'from-gray-300 to-gray-400', bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50', borderColor: 'border-gray-200', icon: Music },
  { color: 'from-amber-600 to-amber-700', bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50', borderColor: 'border-amber-200', icon: Flame },
  { color: 'from-[#8B1A2B] to-[#A63346]', bgColor: 'bg-gradient-to-br from-[#FDF2F4] to-[#FCE7EB]', borderColor: 'border-[#FCE7EB]', icon: TrendingUp },
]

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export default function RankingSection() {
  const [rankingData, setRankingData] = useState<Array<{position: number; song: string; artist: string; album: string; weeks: number; trend: string}>>([])
  const [isFromWP, setIsFromWP] = useState(false)
  const [wpStatus, setWpStatus] = useState<'loading' | 'connected' | 'offline'>('loading')

  useEffect(() => {
    async function fetchRanking() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000) // 5 segundos máximo

        const res = await fetch(`${WP_API}/wp/v2/ranking?per_page=4&_embed=true&_t=${Date.now()}`, { 
          cache: 'no-store',
          headers: { 'ngrok-skip-browser-warning': 'true' },
          signal: controller.signal,
        })
        clearTimeout(timeout)

        if (!res.ok) {
          setWpStatus('offline')
          return
        }
        const data = await res.json()
        if (data && data.length > 0) {
          const items = data.map((item: any) => ({
            position: item.meta?.position || item.position || 0,
            song: item.meta?.song || '',
            artist: item.meta?.artist || '',
            album: item.meta?.album || '',
            weeks: item.meta?.weeks || 0,
            trend: item.meta?.trend || 'same',
          }))
          items.sort((a: any, b: any) => a.position - b.position)
          setRankingData(items.slice(0, 4))
          setIsFromWP(true)
          setWpStatus('connected')
        } else {
          setWpStatus('offline')
        }
      } catch {
        setWpStatus('offline')
      }
    }
    fetchRanking()
  }, [])

  const displayData = rankingData.length > 0 ? rankingData : fallbackRanking

  return (
    <section id="ranking" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A2B] via-[#7A1525] to-[#6B0F1E]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-4">
            <Flame className="w-4 h-4 text-[#FFD166]" />
            <span className="text-white/90 text-sm font-medium">Lo más escuchado</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ranking Internacional
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Las canciones de rock que dominan las ondas radiales esta semana
          </p>
          {isFromWP && (
            <p className="text-green-300 text-xs mt-2">✓ Datos desde WordPress</p>
          )}
          {!isFromWP && wpStatus === 'offline' && (
            <p className="text-amber-300 text-xs mt-2">⚡ WordPress en mantenimiento — Mostrando datos de ejemplo</p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {displayData.slice(0, 4).map((item, index) => {
            const style = cardStyles[index] || cardStyles[0]
            const IconComponent = style.icon
            return (
              <motion.div
                key={item.position || index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`${style.bgColor} ${style.borderColor} border-2 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center shadow-md`}>
                    <span className="text-white font-extrabold text-lg">#{item.position}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : item.trend === 'down' ? (
                      <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                    ) : (
                      <Flame className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="text-xs text-gray-500 font-medium">{item.weeks} sem.</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#8B1A2B] transition-colors line-clamp-1">
                  {item.song}
                </h3>
                <p className="text-gray-600 text-sm font-medium mb-1">{item.artist}</p>
                <p className="text-gray-400 text-xs">{item.album}</p>
                <div className="mt-4 flex justify-end opacity-20 group-hover:opacity-40 transition-opacity">
                  <IconComponent className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
            <Music className="w-4 h-4" />
            Ver Ranking Completo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
