'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#video-ranking', label: 'Video Ranking' },
  { href: '#ranking', label: 'Ranking' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#noticias', label: 'Noticias' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#redes', label: 'Redes' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/images/logo-rmtv.png"
              alt="Radio Miraflores TV"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <p className={`font-bold text-sm leading-tight ${isScrolled ? 'text-[#8B1A2B]' : 'text-white'}`}>
                Radio Miraflores
              </p>
              <p className={`text-xs leading-tight ${isScrolled ? 'text-[#A63346]' : 'text-white/80'}`}>
                Televisión
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-[#8B1A2B] hover:bg-[#8B1A2B]/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              className="ml-3 px-5 py-2 bg-[#8B1A2B] text-white rounded-full text-sm font-semibold hover:bg-[#6B0F1E] transition-all duration-200 hover:scale-105 shadow-lg shadow-[#8B1A2B]/25"
            >
              ¡Escúchanos!
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-[#8B1A2B]' : 'text-white'}`}
            aria-label={isMobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-gray-700 hover:text-[#8B1A2B] hover:bg-[#8B1A2B]/5 font-medium text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setIsMobileOpen(false)}
                className="block text-center px-4 py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm mt-2"
              >
                ¡Escúchanos!
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
