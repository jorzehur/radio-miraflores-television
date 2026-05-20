'use client'

import { motion } from 'framer-motion'
import { ThumbsUp, MessageCircle, Share2, Clock } from 'lucide-react'

interface NoticiaData {
  id: number
  name: string
  time: string
  content: string
  image: string
  likes: number
  comments: number
  shares: number
  color: string
}

export default function NoticiasSectionClient({ noticias }: { noticias: NoticiaData[] }) {
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
            <span className="text-blue-600 text-sm font-medium">Últimas Noticias</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Noticias
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Mantente informado de todo lo que pasa en el mundo del rock
          </p>
        </motion.div>

        {/* Facebook-style News Cards */}
        <div className="space-y-6">
          {noticias.map((noticia, index) => (
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
                    <span className="text-white font-bold text-sm">RM</span>
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
          ))}
        </div>
      </div>
    </section>
  )
}
