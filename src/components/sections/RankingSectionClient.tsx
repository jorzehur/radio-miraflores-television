'use client'

import { motion } from 'framer-motion'
import { Music, Trophy, TrendingUp, Flame } from 'lucide-react'

interface RankingEntry {
  position: number
  song: string
  artist: string
  album: string
  weeks: number
  trend: 'up' | 'down' | 'same'
  color: string
  bgColor: string
  borderColor: string
}

const iconMap = [Trophy, Music, Flame, TrendingUp]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export default function RankingSectionClient({ ranking }: { ranking: RankingEntry[] }) {
  return (
    <section id="ranking" className="relative py-20 md:py-28 overflow-hidden">
      {/* Guinda Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A2B] via-[#7A1525] to-[#6B0F1E]" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/3 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            Las 4 canciones de rock que dominan las ondas radiales esta semana
          </p>
        </motion.div>

        {/* Ranking Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {ranking.map((item, index) => {
            const IconComponent = iconMap[index % iconMap.length]
            return (
              <motion.div
                key={item.position}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`${item.bgColor} ${item.borderColor} border-2 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer`}
              >
                {/* Position Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                    <span className="text-white font-extrabold text-lg">#{item.position}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <Flame className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="text-xs text-gray-500 font-medium">{item.weeks} sem.</span>
                  </div>
                </div>

                {/* Song Info */}
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#8B1A2B] transition-colors line-clamp-1">
                  {item.song}
                </h3>
                <p className="text-gray-600 text-sm font-medium mb-1">{item.artist}</p>
                <p className="text-gray-400 text-xs">{item.album}</p>

                {/* Decorative Icon */}
                <div className="mt-4 flex justify-end opacity-20 group-hover:opacity-40 transition-opacity">
                  <IconComponent className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <Music className="w-4 h-4" />
            Ver Ranking Completo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
