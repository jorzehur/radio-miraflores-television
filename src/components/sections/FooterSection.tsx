'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Radio, ArrowUp } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, TwitterXIcon } from '@/components/SocialIcons'

export default function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
              La estación de rock que mueve tu mundo. Más de 39 años conectando corazones a través de la música.
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
              <p className="text-white/60 text-sm">contacto@radiomiraflores.tv</p>
              <p className="text-white/60 text-sm">+51 (01) 234-5678</p>
              <p className="text-white/60 text-sm">Av. Miraflores 1234</p>
              <p className="text-white/60 text-sm">Lima, Perú</p>
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
              <a
                href="https://www.youtube.com/@RADIOMIRAFLORESTELEVISION"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/60 text-sm hover:text-red-400 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <YoutubeIcon size={16} />
                </div>
                YouTube
              </a>
              <a
                href="https://www.instagram.com/radiomiraflorestelevision/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/60 text-sm hover:text-pink-400 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                  <InstagramIcon size={16} />
                </div>
                Instagram
              </a>
              <a
                href="https://x.com/Rmiraflorestv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/60 text-sm hover:text-blue-400 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <TwitterXIcon size={16} />
                </div>
                X (Twitter)
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Radio Miraflores Televisión. Todos los derechos reservados.
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
