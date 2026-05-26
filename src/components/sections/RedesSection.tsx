'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Heart, MessageCircle, Repeat2, Eye, EyeOff, ChevronDown, Radio } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, TwitterXIcon } from '@/components/SocialIcons'

interface RedSocial {
  id: string
  platform: string
  url: string
  embedUrl?: string | null
  username: string
  followers: string
  active: boolean
  sortOrder: number
  updatedAt: string
}

interface RedesData {
  id: string
  subtitle: string
  title: string
  description: string
  updatedAt: string
  items: RedSocial[]
}

const defaultItems: RedSocial[] = [
  {
    id: '1',
    platform: 'youtube',
    url: 'https://www.youtube.com/@RADIOMIRAFLORESTELEVISION',
    embedUrl: 'https://www.youtube.com/embed/F3W_aR26Cbo?autoplay=0',
    username: '@RADIOMIRAFLORESTELEVISION',
    followers: '10K suscriptores',
    active: true,
    sortOrder: 0,
    updatedAt: '',
  },
  {
    id: '2',
    platform: 'instagram',
    url: 'https://www.instagram.com/radiomiraflorestelevision/',
    embedUrl: null,
    username: '@radiomiraflorestelevision',
    followers: '25K seguidores',
    active: true,
    sortOrder: 1,
    updatedAt: '',
  },
  {
    id: '3',
    platform: 'twitter',
    url: 'https://x.com/Rmiraflorestv',
    embedUrl: null,
    username: '@Rmiraflorestv',
    followers: '8K seguidores',
    active: true,
    sortOrder: 2,
    updatedAt: '',
  },
]

const defaultData: RedesData = {
  id: 'default',
  subtitle: 'Síguenos en redes',
  title: 'Redes Sociales',
  description: 'Conéctate con nosotros en todas las plataformas',
  updatedAt: '',
  items: defaultItems,
}

// Platform style mapping
const platformStyles: Record<string, {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: any
}> = {
  youtube: {
    label: 'YouTube',
    color: 'from-red-600 to-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    icon: YoutubeIcon,
  },
  instagram: {
    label: 'Instagram',
    color: 'from-purple-600 via-pink-500 to-orange-400',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-purple-100',
    icon: InstagramIcon,
  },
  twitter: {
    label: 'X (Twitter)',
    color: 'from-gray-800 to-gray-900',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: TwitterXIcon,
  },
  facebook: {
    label: 'Facebook',
    color: 'from-[#1877F2] to-[#0D65D9]',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    icon: null, // Will use SVG
  },
  tiktok: {
    label: 'TikTok',
    color: 'from-black to-gray-800',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: null, // Will use SVG
  },
  spotify: {
    label: 'Spotify',
    color: 'from-[#1DB954] to-[#1ed760]',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100',
    icon: null,
  },
}

// Facebook SVG Icon
function FacebookIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

// TikTok SVG Icon
function TikTokIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

// Spotify SVG Icon
function SpotifyIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function getPlatformIcon(platform: string) {
  const styles = platformStyles[platform]
  if (styles?.icon) return styles.icon
  switch (platform) {
    case 'facebook': return FacebookIcon
    case 'tiktok': return TikTokIcon
    case 'spotify': return SpotifyIcon
    default: return YoutubeIcon
  }
}

function isAllowedEmbedUrl(url: string | null | undefined) {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function renderPlatformEmbed(platform: string, embedUrl: string) {
  switch (platform) {
    case 'youtube':
      return (
        <div className="mt-3 rounded-xl overflow-hidden bg-black aspect-video border border-gray-100/50 shadow-inner">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="Ultima publicacion en YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )
    case 'facebook':
      return (
        <div className="mt-3 rounded-xl overflow-hidden bg-white p-2 border border-gray-100/50 shadow-inner flex justify-center h-[340px]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      )
    case 'instagram':
      return (
        <div className="mt-3 rounded-xl overflow-hidden bg-white border border-gray-100/50 shadow-inner h-[620px]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            scrolling="no"
            frameBorder="0"
            allowTransparency={true}
          ></iframe>
        </div>
      )
    case 'twitter':
      return (
        <div className="mt-3 rounded-xl overflow-hidden bg-white border border-gray-100/50 shadow-inner h-[620px]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      )
    case 'spotify':
      return (
        <div className="mt-3 rounded-xl overflow-hidden bg-black h-[152px] border border-gray-100/50 shadow-inner">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )
    case 'tiktok':
      return (
        <div className="mt-3 rounded-xl overflow-hidden bg-white border border-gray-100/50 shadow-inner h-[720px]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      )
    default:
      return (
        <div className="mt-3 rounded-xl overflow-hidden bg-white border border-gray-100/50 shadow-inner h-[520px]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            scrolling="no"
            frameBorder="0"
          ></iframe>
        </div>
      )
  }
}

export default function RedesSection() {
  const [data, setData] = useState<RedesData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSocials, setExpandedSocials] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setExpandedSocials(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  useEffect(() => {
    let isMounted = true

    async function fetchRedes() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch('/api/public/redes', {
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()

        if (!isMounted) return
        if (json && json.title) {
          setData(json)
        }
      } catch {
        // Keep fallback data
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchRedes()
    return () => { isMounted = false }
  }, [])

  const items = data.items && data.items.length > 0 ? data.items : defaultItems

  return (
    <section id="redes" className="py-20 md:py-28 bg-gradient-to-b from-white via-[#FFF5F6] to-[#FFF9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B1A2B]/10 rounded-full mb-4">
            <YoutubeIcon className="w-4 h-4 text-[#8B1A2B]" />
            <span className="text-[#8B1A2B] text-sm font-semibold">{data.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {data.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
            {data.description}
          </p>
        </motion.div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((social, index) => {
            // Si la red está oculta, mostrar solo un botón para volver a mostrarla
            if (!social.active) {
              return (
                <div key={social.id || social.platform} className="flex items-center justify-center p-4 border-2 rounded-2xl bg-gray-50">
                  <button
                    onClick={() => {
                      setData(prev => ({
                        ...prev,
                        items: prev.items.map(it => it.id === social.id ? { ...it, active: true } : it),
                      }))
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    <Eye className="w-4 h-4" /> Mostrar
                  </button>
                </div>
              );
            }
            const styles = platformStyles[social.platform] || platformStyles.youtube;
            const IconComponent = getPlatformIcon(social.platform);
            const label = styles.label || social.platform;
            const isExpanded = !!expandedSocials[social.id];
            const hasEmbed = isAllowedEmbedUrl(social.embedUrl);

            const renderLatestPost = () => {
              if (hasEmbed && social.embedUrl) {
                return renderPlatformEmbed(social.platform, social.embedUrl);
              }
              switch (social.platform) {
                case 'youtube':
                  return (
                    <div className="mt-3 rounded-xl overflow-hidden bg-black aspect-video border border-gray-100/50 shadow-inner">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/F3W_aR26Cbo?autoplay=0"
                        title="Última transmisión en YouTube"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  );
                case 'facebook':
                  return (
                    <div className="mt-3 rounded-xl overflow-hidden bg-white p-2 border border-gray-100/50 shadow-inner flex justify-center h-[340px]">
                      <iframe
                        src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fradiomiraflorestelevision%2Fposts%2Fpfbid02uRk3eRAGLoSpX6DtULxF9d7PtFTkynQkyonRf7vwguCGoWo9qAXwn41a9Qdv3vvyl&show_text=true&width=500"
                        width="100%"
                        height="100%"
                        style={{ border: 'none', overflow: 'hidden' }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      ></iframe>
                    </div>
                  );
                case 'instagram':
                  return (
                    <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3 shadow-inner text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-orange-400 p-[1.5px]">
                          <div className="w-full h-full bg-white rounded-full p-[1px]">
                            <img src="/images/logo-rmtv.png" className="w-full h-full rounded-full" alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-900 leading-tight">radiomiraflorestelevision</p>
                          <p className="text-[8px] text-gray-400 font-medium">Miraflores, Lima</p>
                        </div>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2">
                        <img src="/images/hero-radio-studio.png" className="w-full h-full object-cover" alt="Post" />
                      </div>
                      <div className="flex items-center gap-3 mb-1 text-gray-700">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500 cursor-pointer hover:scale-110 transition-transform" />
                        <MessageCircle className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
                        <span className="text-[9px] text-gray-400 ml-auto font-semibold">Hace 2 horas</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-snug">
                        <span className="font-bold text-gray-900 mr-1">radiomiraflorestelevision</span>
                        ¡Gran noche de rock clásico en el estudio! Gracias a todos los que sintonizaron. 🎸🤘📸 #RadioMiraflores
                      </p>
                    </div>
                  );
                case 'twitter':
                  return (
                    <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-inner text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <img src="/images/logo-rmtv.png" className="w-8 h-8 rounded-full border border-gray-100" alt="Avatar" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 flex items-center gap-1 leading-tight">
                            Radio Miraflores TV
                            <span className="w-3 h-3 bg-blue-500 text-white rounded-full flex items-center justify-center text-[7px] font-bold">✓</span>
                          </p>
                          <p className="text-[9px] text-gray-400">@Rmiraflorestv · Hace 3h</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed mb-3 font-medium">
                        ¡El Ranking de esta semana está que arde! Bohemian Rhapsody de Queen recupera el #1. ¿Cuál es tu tema favorito? Vota usando el hashtag <span className="text-[#8B1A2B] font-semibold">#RankingMiraflores</span> 🏆🎸
                      </p>
                      <div className="flex justify-between text-gray-400 text-[10px] font-bold border-t border-gray-100 pt-2">
                        <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"><Repeat2 className="w-3.5 h-3.5" /> 18</span>
                        <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer"><Heart className="w-3.5 h-3.5" /> 124</span>
                        <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"><MessageCircle className="w-3.5 h-3.5" /> 12</span>
                      </div>
                    </div>
                  );
                case 'spotify':
                  return (
                    <div className="mt-3 rounded-xl overflow-hidden bg-black h-[152px] border border-gray-100/50 shadow-inner">
                      <iframe
                        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGo761yv?utm_source=generator"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      ></iframe>
                    </div>
                  );
                default:
                  return null;
              }
            };

            return (
              <motion.div
                key={social.id || social.platform}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: isExpanded ? 0 : -8, scale: isExpanded ? 1 : 1.02 }}
                className={`${styles.bgColor} ${styles.borderColor} border-2 rounded-2xl overflow-hidden group relative shadow-md hover:shadow-2xl transition-all duration-300 hover:border-[#8B1A2B]/15 flex flex-col`}
              >
                {/* Hide button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setData(prev => ({
                      ...prev,
                      items: prev.items.map(it => it.id === social.id ? { ...it, active: false } : it),
                    }));
                  }}
                  className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-20 cursor-pointer"
                >
                  <EyeOff className="w-4 h-4 text-gray-600" />
                </button>

                {/* Card Header with gradient */}
                <div 
                  onClick={() => window.open(social.url, '_blank')}
                  className={`bg-gradient-to-r ${styles.color} p-5 relative overflow-hidden cursor-pointer`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-lg flex items-center gap-1.5">
                        {label}
                        <ExternalLink className="w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-white/70 text-sm font-semibold">{social.username}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-0.5 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          Seguidores
                        </p>
                        <p className="text-gray-800 text-sm font-bold">
                          {social.followers}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Connected Feed Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {renderLatestPost()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Feed Connection Button */}
                  <div className="mt-4 pt-2 border-t border-gray-100/50">
                    {hasEmbed ? (
                      <p className="mb-2 text-[11px] font-medium text-gray-500">
                        Vista real cargada desde la URL embed configurada en el panel.
                      </p>
                    ) : (
                      <p className="mb-2 text-[11px] font-medium text-gray-500">
                        Vista de referencia mientras configuras el embed real desde el panel.
                      </p>
                    )}
                    <button
                      onClick={(e) => toggleExpand(social.id, e)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                        isExpanded
                          ? 'bg-[#8B1A2B] text-white shadow-md shadow-[#8B1A2B]/10 hover:bg-[#6B0F1E]'
                          : 'bg-white/80 hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${isExpanded ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                      {isExpanded ? 'Ocultar vista previa' : hasEmbed ? 'Ver ultima publicacion real' : 'Ver vista de referencia'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className={`h-1 bg-gradient-to-r ${styles.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
