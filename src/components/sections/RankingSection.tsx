'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Trophy, TrendingUp, Flame } from 'lucide-react'

interface RankingItem {
  id: string
  position: number
  song: string
  artist: string
  album: string
  weeks: number
  trend: string
  imageUrl?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

const fallbackRanking: RankingItem[] = [
  { id: '1', position: 1, song: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', weeks: 12, trend: 'up', active: true, createdAt: '', updatedAt: '', imageUrl: 'https://via.placeholder.com/400x400?text=Queen+Album' },
  { id: '2', position: 2, song: 'Hotel California', artist: 'Eagles', album: 'Hotel California', weeks: 8, trend: 'up', active: true, createdAt: '', updatedAt: '', imageUrl: 'https://via.placeholder.com/400x400?text=Eagles+Album' },
  { id: '3', position: 3, song: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', weeks: 15, trend: 'same', active: true, createdAt: '', updatedAt: '', imageUrl: 'https://via.placeholder.com/400x400?text=Led+Zeppelin+Album' },
  { id: '4', position: 4, song: "Sweet Child O' Mine", artist: "Guns N' Roses", album: 'Appetite for Destruction', weeks: 6, trend: 'up', active: true, createdAt: '', updatedAt: '', imageUrl: 'https://via.placeholder.com/400x400?text=Guns+N+Roses+Album' },
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

export default function RankingSection() {
  const [ranking, setRanking] = useState<RankingItem[]>(fallbackRanking)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchRanking() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch('/api/public/ranking', {
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          const hasData = data.some((i: RankingItem) => i.song && i.song.length > 0)
          if (hasData) {
            setRanking(data)
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
    <section id="ranking" className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-white via-[#FFF5F6] to-[#FFF9F2]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#8B1A2B]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#8B1A2B]/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B1A2B]/10 rounded-full mb-4">
            <Flame className="w-4 h-4 text-[#8B1A2B]" />
            <span className="text-[#8B1A2B] text-sm font-semibold">Lo más escuchado</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Ranking Internacional
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
            Las canciones de rock que dominan las ondas radiales esta semana
          </p>
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
                className={`${style.bgColor} ${style.borderColor} border-2 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-[#8B1A2B]/20 transition-all duration-300 group cursor-pointer`}
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
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={`${item.album} cover`}
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                )}
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
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B1A2B]/10 text-[#8B1A2B] rounded-full font-semibold hover:bg-[#8B1A2B]/20 transition-all duration-300 border border-[#8B1A2B]/20">
            <Music className="w-4 h-4" />
            Ver Ranking Completo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
