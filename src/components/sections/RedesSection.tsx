'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Heart, MessageCircle, Repeat2, Eye } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, TwitterXIcon } from '@/components/SocialIcons'

const socialData = [
  {
    platform: 'YouTube',
    icon: YoutubeIcon,
    url: 'https://www.youtube.com/@RADIOMIRAFLORESTELEVISION',
    handle: '@RADIOMIRAFLORESTELEVISION',
    color: 'from-red-600 to-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    latestPost: {
      title: 'Entrevista Exclusiva: El futuro del Rock en 2024',
      views: '12.5K vistas',
      time: 'Hace 3 días',
      likes: '845',
    },
  },
  {
    platform: 'Instagram',
    icon: InstagramIcon,
    url: 'https://www.instagram.com/radiomiraflorestelevision/',
    handle: '@radiomiraflorestelevision',
    color: 'from-purple-600 via-pink-500 to-orange-400',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-purple-100',
    latestPost: {
      title: 'Detrás de cámaras del programa matutino 🎙️',
      views: '5.2K me gusta',
      time: 'Hace 1 día',
      likes: '5.2K',
    },
  },
  {
    platform: 'X (Twitter)',
    icon: TwitterXIcon,
    url: 'https://x.com/Rmiraflorestv',
    handle: '@Rmiraflorestv',
    color: 'from-gray-800 to-gray-900',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    latestPost: {
      title: '¡Nuevo número 1 en el Ranking Internacional! 🏆🎸 ¿Quién será? Sintoniza ahora...',
      views: '3.8K impresiones',
      time: 'Hace 6 horas',
      likes: '234',
    },
  },
]

export default function RedesSection() {
  return (
    <section id="redes" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-50 to-purple-50 rounded-full mb-4">
            <YoutubeIcon className="w-4 h-4 text-red-500" />
            <span className="text-gray-600 text-sm font-medium">Síguenos en redes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Redes Sociales
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Conéctate con nosotros en todas las plataformas
          </p>
        </motion.div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socialData.map((social, index) => {
            const IconComponent = social.icon
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`${social.bgColor} ${social.borderColor} border-2 rounded-2xl overflow-hidden group cursor-pointer block`}
              >
                {/* Card Header with gradient */}
                <div className={`bg-gradient-to-r ${social.color} p-5 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{social.platform}</h3>
                      <p className="text-white/70 text-sm">{social.handle}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/50 ml-auto group-hover:text-white/80 transition-colors" />
                  </div>
                </div>

                {/* Latest Post */}
                <div className="p-5">
                  <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    Última publicación
                  </p>
                  <p className="text-gray-800 text-sm leading-relaxed mb-3 group-hover:text-[#8B1A2B] transition-colors">
                    {social.latestPost.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {social.latestPost.likes}
                      </span>
                      {social.platform === 'X (Twitter)' && (
                        <span className="flex items-center gap-1">
                          <Repeat2 className="w-3 h-3" />
                          89
                        </span>
                      )}
                      {social.platform === 'YouTube' && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          56
                        </span>
                      )}
                    </div>
                    <span>{social.latestPost.time}</span>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className={`h-1 bg-gradient-to-r ${social.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
