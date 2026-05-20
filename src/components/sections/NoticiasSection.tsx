'use client'

import { motion } from 'framer-motion'
import { ThumbsUp, MessageCircle, Share2, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

// Fallback data
const fallbackNoticias = [
  {
    id: 1,
    avatar: 'RM',
    name: 'Radio Miraflores TV',
    time: 'Hace 2 horas',
    content: '🎸 ¡NO TE LO PIERDAS! Esta noche a las 8:00 PM estrenamos entrevista exclusiva con la banda de rock alternativo que está revolucionando la escena musical. Prepárate para una noche llena de rock en vivo y sorpresas. ¡Sintoniza! 🔥🎶 #RockEnVivo #RadioMiraflores',
    image: '/images/hero-radio-studio.png',
    likes: 245,
    comments: 38,
    shares: 56,
    color: 'from-[#8B1A2B] to-[#A63346]',
  },
  {
    id: 2,
    avatar: 'RM',
    name: 'Radio Miraflores TV',
    time: 'Hace 5 horas',
    content: '🏆 ¡NUEVO LÍDER DEL RANKING! "Bohemian Rhapsody" de Queen vuelve a coronarse en el #1 de nuestro Ranking Internacional de Rock. ¿Estás de acuerdo con esta posición? ¡Comenta y comparte tu opinión! La voz de nuestros oyentes es lo que más importa 🤘📻 #RankingRock #Queen',
    image: '/images/hero-video-thumb.png',
    likes: 412,
    comments: 89,
    shares: 127,
    color: 'from-[#F5A623] to-[#FFD166]',
  },
]

interface WPNoticia {
  id: number
  title: string
  slug: string
  date: string
  excerpt: string
  content: string
  image: string | null
  author: string
  categories: Array<{ id: number; name: string; slug: string }>
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-PE')
  } catch {
    return dateStr
  }
}

export default function NoticiasSection() {
  const [noticias, setNoticias] = useState<WPNoticia[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await fetch('/api/wordpress/noticias?per_page=2')
        const data = await res.json()
        if (data.status === 'ok' && data.data.length > 0) {
          setNoticias(data.data)
        }
      } catch {
        // Use fallback data
      } finally {
        setIsLoading(false)
      }
    }
    fetchNoticias()
  }, [])

  // Use WP data or fallback
  const hasWpData = noticias.length > 0

  return (
    <section id="noticias" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full mb-4">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 text-sm font-medium">
              {isLoading ? 'Cargando...' : 'Últimas Noticias'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Noticias
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Mantente informado de todo lo que pasa en el mundo del rock
          </p>
          {hasWpData && (
            <p className="text-gray-400 text-xs mt-2">Datos desde WordPress</p>
          )}
        </motion.div>

        {/* Facebook-style News Cards */}
        <div className="space-y-6">
          {hasWpData ? (
            // Dynamic WordPress data
            noticias.map((noticia, index) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8B1A2B] to-[#A63346] flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">RM</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">Radio Miraflores TV</h4>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(noticia.date)}</span>
                        <span>·</span>
                        <span>🌍</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <h3 className="text-gray-800 font-semibold text-base mb-2" dangerouslySetInnerHTML={{ __html: noticia.title }} />
                  <p className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: noticia.excerpt }} />
                </div>

                {/* Post Image */}
                {noticia.image && (
                  <div className="relative cursor-pointer group">
                    <img
                      src={noticia.image}
                      alt={noticia.title}
                      className="w-full h-56 sm:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Reactions Summary */}
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="flex -space-x-1">
                        <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">👍</span>
                        <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">❤️</span>
                      </span>
                    </div>
                    <span>{formatDate(noticia.date)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-2 py-1">
                  <div className="flex items-center">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Me gusta
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Comentar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <Share2 className="w-4 h-4" />
                      Compartir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback static data
            fallbackNoticias.map((noticia, index) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${noticia.color} flex items-center justify-center shadow-md`}>
                      <span className="text-white font-bold text-sm">{noticia.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{noticia.name}</h4>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{noticia.time}</span>
                        <span>·</span>
                        <span>🌍</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors">
                      <span className="text-gray-400 text-lg">···</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-800 text-sm leading-relaxed">{noticia.content}</p>
                </div>

                {/* Post Image */}
                <div className="relative cursor-pointer group">
                  <img
                    src={noticia.image}
                    alt="Noticia"
                    className="w-full h-56 sm:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                {/* Reactions Summary */}
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="flex -space-x-1">
                        <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">👍</span>
                        <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">❤️</span>
                      </span>
                      <span className="ml-1">{noticia.likes}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{noticia.comments} comentarios</span>
                      <span>{noticia.shares} compartidos</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-2 py-1">
                  <div className="flex items-center">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Me gusta
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Comentar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <Share2 className="w-4 h-4" />
                      Compartir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
