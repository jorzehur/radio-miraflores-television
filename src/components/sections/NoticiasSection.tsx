'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, MessageCircle, Share2, Clock, ExternalLink } from 'lucide-react'

interface NoticiaItem {
  id: number
  title: string
  date: string
  excerpt: string
  image: string
  author: string
  time?: string
  content?: string
  likes?: number
  comments?: number
  shares?: number
  hasFacebookEmbed?: boolean
  facebookEmbedUrl?: string | null
}

const fallbackNoticias: NoticiaItem[] = [
  {
    id: 1,
    time: 'Hace 2 horas',
    title: '¡NO TE LO PIERDAS! Entrevista exclusiva con la banda de rock alternativo del momento',
    content: '🎸 Esta noche a las 8:00 PM estrenamos entrevista exclusiva con la banda de rock alternativo que está revolucionando la escena musical. Prepárate para una noche llena de rock en vivo y sorpresas. ¡Sintoniza! 🔥🎶 #RockEnVivo #RadioMiraflores',
    image: '/images/hero-radio-studio.png',
    likes: 245,
    comments: 38,
    shares: 56,
    author: 'Radio Miraflores TV',
    date: '',
    excerpt: '',
  },
  {
    id: 2,
    time: 'Hace 5 horas',
    title: '¡NUEVO LÍDER DEL RANKING! "Bohemian Rhapsody" de Queen vuelve al #1',
    content: '🏆 "Bohemian Rhapsody" de Queen vuelve a coronarse en el #1 de nuestro Ranking Internacional de Rock. ¿Estás de acuerdo con esta posición? ¡Comenta y comparte tu opinión! 🤘📻 #RankingRock #Queen',
    image: '/images/hero-video-thumb.png',
    likes: 412,
    comments: 89,
    shares: 127,
    author: 'Radio Miraflores TV',
    date: '',
    excerpt: '',
  },
]

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
  const [noticias, setNoticias] = useState<NoticiaItem[]>(fallbackNoticias)
  const [isFromWP, setIsFromWP] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchNoticias() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)

        // Use local API route as proxy to avoid CORS issues with ngrok
        const res = await fetch('/api/wp/posts?per_page=6', {
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          const items: NoticiaItem[] = data.map((post: any) => ({
            id: post.id,
            title: post.title || 'Publicación',
            date: post.date,
            excerpt: post.excerpt || '',
            content: post.excerpt || '',
            image: post.image || '/images/hero-radio-studio.png',
            author: post.author || 'Radio Miraflores TV',
            hasFacebookEmbed: post.hasFacebookEmbed || false,
            facebookEmbedUrl: post.facebookEmbedUrl || null,
            likes: Math.floor(Math.random() * 400) + 100,
            comments: Math.floor(Math.random() * 100) + 10,
            shares: Math.floor(Math.random() * 150) + 20,
          }))

          if (items.length > 0) {
            setNoticias(items)
            setIsFromWP(true)
          }
        }
      } catch {
        // Keep fallback data
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchNoticias()
    return () => { isMounted = false }
  }, [])

  const displayNoticias = noticias.slice(0, 4)

  return (
    <section id="noticias" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full mb-4">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 text-sm font-medium">Últimas Noticias</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Noticias</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Mantente informado de todo lo que pasa en el mundo del rock
          </p>
          <div className="mt-2">
            {isLoading ? (
              <p className="text-gray-400 text-xs animate-pulse">Conectando con WordPress...</p>
            ) : isFromWP ? (
              <p className="text-green-500 text-xs">✓ Datos desde WordPress</p>
            ) : (
              <p className="text-yellow-500 text-xs">⚠ Usando datos de respaldo (WordPress no disponible)</p>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          {displayNoticias.map((noticia, index) => {
            const isWP = isFromWP
            const isFacebookPost = noticia.hasFacebookEmbed

            return (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                      isFacebookPost
                        ? 'bg-gradient-to-br from-[#1877F2] to-[#0D65D9]'
                        : 'bg-gradient-to-br from-[#8B1A2B] to-[#A63346]'
                    }`}>
                      {isFacebookPost ? (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      ) : (
                        <span className="text-white font-bold text-sm">RM</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">
                        {isFacebookPost ? 'Radio Miraflores TV' : 'Radio Miraflores TV'}
                      </h4>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{isWP && noticia.date ? formatDate(noticia.date) : noticia.time}</span>
                        {isFacebookPost && (
                          <>
                            <span>·</span>
                            <ExternalLink className="w-3 h-3" />
                            <span>Facebook</span>
                          </>
                        )}
                        <span>·</span><span>🌍</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content - Text posts */}
                {noticia.excerpt && !isFacebookPost && (
                  <div className="px-4 pb-3">
                    <h3 className="text-gray-800 font-semibold text-base mb-1">{noticia.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {noticia.excerpt || noticia.content}
                    </p>
                  </div>
                )}

                {/* Content - Facebook embed posts */}
                {isFacebookPost && noticia.facebookEmbedUrl && (
                  <div className="px-4 pb-3">
                    <h3 className="text-gray-800 font-semibold text-base mb-3">{noticia.title}</h3>
                    <div className="flex justify-center">
                      <iframe
                        src={noticia.facebookEmbedUrl}
                        width="500"
                        height="536"
                        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Content - Facebook posts without embed URL (fallback) */}
                {isFacebookPost && !noticia.facebookEmbedUrl && noticia.title && (
                  <div className="px-4 pb-3">
                    <h3 className="text-gray-800 font-semibold text-base mb-1">{noticia.title}</h3>
                    {noticia.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed">{noticia.excerpt}</p>
                    )}
                  </div>
                )}

                {/* Title-only for posts without excerpt (non-Facebook) */}
                {!isFacebookPost && !noticia.excerpt && noticia.title && (
                  <div className="px-4 pb-3">
                    <h3 className="text-gray-800 font-semibold text-base">{noticia.title}</h3>
                  </div>
                )}

                {/* Image - only show for non-Facebook posts */}
                {!isFacebookPost && (
                  <div className="relative cursor-pointer group">
                    <img
                      src={noticia.image || '/images/hero-radio-studio.png'}
                      alt={noticia.title}
                      className="w-full h-56 sm:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Reactions - only show for fallback data */}
                {!isWP && (
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
                )}

                {/* Actions */}
                <div className="px-2 py-1">
                  <div className="flex items-center">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <ThumbsUp className="w-4 h-4" /> Me gusta
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <MessageCircle className="w-4 h-4" /> Comentar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition-colors">
                      <Share2 className="w-4 h-4" /> Compartir
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
