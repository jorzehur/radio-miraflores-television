'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Heart, MessageCircle, Repeat2, Eye } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, TwitterXIcon } from '@/components/SocialIcons'
import { EyeOff } from 'lucide-react'

interface RedSocial {
  id: string
  platform: string
  url: string
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

export default function RedesSection() {
  const [data, setData] = useState<RedesData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)

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
            <span className="text-gray-600 text-sm font-medium">{data.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {data.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
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
            return (
              <motion.a
                key={social.id || social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`${styles.bgColor} ${styles.borderColor} border-2 rounded-2xl overflow-hidden group cursor-pointer block relative`}
              >
                {/* Hide button */}
                <button
                  onClick={() => {
                    setData(prev => ({
                      ...prev,
                      items: prev.items.map(it => it.id === social.id ? { ...it, active: false } : it),
                    }));
                  }}
                  className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
                {/* Card Header with gradient */}
                <div className={`bg-gradient-to-r ${styles.color} p-5 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{label}</h3>
                      <p className="text-white/70 text-sm">{social.username}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/50 ml-auto group-hover:text-white/80 transition-colors" />
                  </div>
                </div>

                {/* Followers */}
                <div className="p-5">
                  <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    Seguidores
                  </p>
                  <p className="text-gray-800 text-sm font-semibold group-hover:text-[#8B1A2B] transition-colors">
                    {social.followers}
                  </p>
                </div>

                {/* Bottom bar */}
                <div className={`h-1 bg-gradient-to-r ${styles.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  )
}
