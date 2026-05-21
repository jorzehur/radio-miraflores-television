'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Trophy, TrendingUp, Flame } from 'lucide-react'

interface RankingItem {
  id: number
  position: number
  song: string
  artist: string
  album: string
  weeks: number
  trend: 'up' | 'down' | 'same'
  imageUrl?: string | null
}

const fallbackRanking: RankingItem[] = [
  { id: 1, position: 1, song: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', weeks: 12, trend: 'up' },
  { id: 2, position: 2, song: 'Hotel California', artist: 'Eagles', album: 'Hotel California', weeks: 8, trend: 'up' },
  { id: 3, position: 3, song: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', weeks: 15, trend: 'same' },
  { id: 4, position: 4, song: "Sweet Child O' Mine", artist: "Guns N' Roses", album: 'Appetite for Destruction', weeks: 6, trend: 'up' },
]

const cardStyles = [
  { color: 'from-yellow-400 to-amber-500', bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50', borderColor: 'border-yellow-200', icon: Trophy },
  { color: 'from-gray-300 to-gray-400', bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50', borderColor: 'border-gray-200', icon: Music },
  { color: 'from-amber-600 to-amber-700', bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50', borderColor: 'border-amber-200', icon: Flame },
  { color: 'from-[#8B1A2B] to-[#A63346]', bgColor: 'bg-gradient-to-br from-[#FDF2F4] to-[#FCE7EB]', borderColor: 'border-[#FCE7EB]', icon: TrendingUp },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json'
const WP_SITE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word'

function replaceLocalUrl(url: string): string {
  if (url && url.includes('localhost/word')) {
    return url.replace(/http:\/\/localhost\/word/g, WP_SITE)
  }
  return url
}

export default function RankingSection() {
  const [ranking, setRanking] = useState<RankingItem[]>(fallbackRanking)
  const [isFromWP, setIsFromWP] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchRanking() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)

        // Use local API route as proxy to avoid CORS issues with ngrok
        const res = await fetch('/api/wp/ranking?per_page=10', {
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          // API route already transforms the data
          const items: RankingItem[] = data
            .map((item: any) => ({
              id: item.id,
              position: item.position || 0,
              song: item.song || '',
              artist: item.artist || '',
              album: item.album || '',
              weeks: item.weeks || 0,
              trend: item.trend || 'same',
              imageUrl: item.imageUrl ? replaceLocalUrl(item.imageUrl) : null,
            }))
            .sort((a: RankingItem, b: RankingItem) => a.position - b.position)

          // Only mark as WP if we have meaningful data (not all empty)
          const hasData = items.some(i => i.song && i.song.length > 0)
          if (hasData) {
            setRanking(items)
            setIsFromWP(true)
          }
        }
      } catch {
        // Keep fallback data
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchRanking()
    return () => { isMounted = false }
  }, [])

  const displayData = ranking.slice(0, 4)

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
          <div className="mt-2">
            {isLoading ? (
              <p className="text-white/50 text-xs animate-pulse">Conectando con WordPress...</p>
            ) : isFromWP ? (
              <p className="text-green-300 text-xs">✓ Datos desde WordPress</p>
            ) : (
              <p className="text-yellow-300 text-xs">⚠ Usando datos de respaldo (WordPress no disponible)</p>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {displayData.map((item, index) => {
            const style = cardStyles[index] || cardStyles[0]
            const IconComponent = style.icon
            return (
              <motion.div
                key={item.id || index}
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
