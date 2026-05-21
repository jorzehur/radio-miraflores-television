'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Radio, ArrowUp } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, TwitterXIcon } from '@/components/SocialIcons'

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

interface InfoData {
  email: string
  phone: string
  address: string
}

interface FooterData {
  id: string
  description: string
  copyright: string
  updatedAt: string
}

interface FooterFullData {
  footer: FooterData
  redes: RedSocial[]
  info: InfoData
}

const defaultFooter: FooterData = {
  id: 'default',
  description: 'La estación de rock que mueve tu mundo. Más de 39 años conectando corazones a través de la música.',
  copyright: `© ${new Date().getFullYear()} Radio Miraflores Televisión. Todos los derechos reservados.`,
  updatedAt: '',
}

const defaultRedes: RedSocial[] = [
  { id: '1', platform: 'youtube', url: 'https://www.youtube.com/@RADIOMIRAFLORESTELEVISION', username: '@RADIOMIRAFLORESTELEVISION', followers: '', active: true, sortOrder: 0, updatedAt: '' },
  { id: '2', platform: 'instagram', url: 'https://www.instagram.com/radiomiraflorestelevision/', username: '@radiomiraflorestelevision', followers: '', active: true, sortOrder: 1, updatedAt: '' },
  { id: '3', platform: 'twitter', url: 'https://x.com/Rmiraflorestv', username: '@Rmiraflorestv', followers: '', active: true, sortOrder: 2, updatedAt: '' },
]

const defaultInfo: InfoData = {
  email: 'contacto@radiomiraflores.tv',
  phone: '+51 (01) 234-5678',
  address: 'Av. Miraflores 1234, Lima, Perú',
}

const platformIconMap: Record<string, { icon: any; hoverColor: string; hoverBg: string }> = {
  youtube: { icon: YoutubeIcon, hoverColor: 'hover:text-red-400', hoverBg: 'group-hover:bg-red-500/20' },
  instagram: { icon: InstagramIcon, hoverColor: 'hover:text-pink-400', hoverBg: 'group-hover:bg-pink-500/20' },
  twitter: { icon: TwitterXIcon, hoverColor: 'hover:text-blue-400', hoverBg: 'group-hover:bg-blue-500/20' },
  facebook: { icon: null, hoverColor: 'hover:text-blue-400', hoverBg: 'group-hover:bg-blue-500/20' },
  tiktok: { icon: null, hoverColor: 'hover:text-gray-300', hoverBg: 'group-hover:bg-gray-500/20' },
  spotify: { icon: null, hoverColor: 'hover:text-green-400', hoverBg: 'group-hover:bg-green-500/20' },
}

const platformLabels: Record<string, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  spotify: 'Spotify',
}

export default function FooterSection() {
  const [footer, setFooter] = useState<FooterData>(defaultFooter)
  const [redes, setRedes] = useState<RedSocial[]>(defaultRedes)
  const [info, setInfo] = useState<InfoData>(defaultInfo)
  const [isFromDB, setIsFromDB] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    let isMounted = true

    async function fetchFooterData() {
      try {
        // Fetch footer, redes, and info in parallel
        const [footerRes, redesRes, infoRes] = await Promise.all([
          fetch('/api/public/footer', { signal: AbortSignal.timeout(5000) }),
          fetch('/api/public/redes', { signal: AbortSignal.timeout(5000) }),
          fetch('/api/public/info', { signal: AbortSignal.timeout(5000) }),
        ])

        if (!isMounted) return

        let loaded = false

        if (footerRes.ok) {
          const footerData = await footerRes.json()
          if (footerData && footerData.description) {
            setFooter(footerData)
            loaded = true
          }
        }

        if (redesRes.ok) {
          const redesData = await redesRes.json()
          if (redesData?.items?.length > 0) {
            setRedes(redesData.items)
            loaded = true
          }
        }

        if (infoRes.ok) {
          const infoData = await infoRes.json()
          if (infoData && infoData.email) {
            setInfo({ email: infoData.email, phone: infoData.phone, address: infoData.address })
            loaded = true
          }
        }

        if (loaded) setIsFromDB(true)
      } catch {
        // Keep fallback data
      }
    }

    fetchFooterData()
    return () => { isMounted = false }
  }, [])

  return (
    <footer className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/footer-bg.png"
          alt="Radio Miraflores"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B1A2B]/95 via-[#6B0F1E]/95 to-[#3A0812]/98" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo-rmtv.png"
                alt="Radio Miraflores TV"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="text-white font-bold text-lg">Radio Miraflores</h3>
                <p className="text-white/60 text-xs">Televisión</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {footer.description}
            </p>
            <div className="flex items-center gap-1 text-[#F5A623]">
              <Radio className="w-4 h-4" />
              <span className="text-sm font-semibold">¡Siempre en vivo!</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Enlaces</h4>
            <ul className="space-y-2.5">
              {['Inicio', 'Ranking', 'Nosotros', 'Noticias', 'Testimonios', 'Contacto'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-white/60 text-sm hover:text-[#FFD166] transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 bg-[#8B1A2B] rounded-full" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contacto</h4>
            <div className="space-y-3">
              <p className="text-white/60 text-sm">{info.email}</p>
              <p className="text-white/60 text-sm">{info.phone}</p>
              <p className="text-white/60 text-sm">{info.address}</p>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Síguenos</h4>
            <div className="space-y-3">
              {redes.map((social) => {
                const platformInfo = platformIconMap[social.platform]
                const label = platformLabels[social.platform] || social.platform
                const IconComponent = platformInfo?.icon

                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-white/60 text-sm ${platformInfo?.hoverColor || 'hover:text-white'} transition-colors group`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center ${platformInfo?.hoverBg || 'group-hover:bg-white/20'} transition-colors`}>
                      {IconComponent ? (
                        <IconComponent size={16} />
                      ) : (
                        <span className="text-white text-xs font-bold">{label[0]}</span>
                      )}
                    </div>
                    {label}
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              {footer.copyright}
            </p>
            <div className="flex items-center gap-1 text-white/40 text-sm">
              Hecho con <Heart className="w-3.5 h-3.5 text-[#8B1A2B] fill-[#8B1A2B]" /> para los amantes del rock
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#8B1A2B] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#6B0F1E] transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Ir arriba"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  )
}
