'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Mic2, Radio, Headphones } from 'lucide-react'

const timelineData = [
  {
    year: '1985',
    title: 'Los Inicios',
    description: 'Donde todo comenzó. Una pequeña cabina con grandes sueños y la pasión por el rock que nos unió.',
    image: '/images/nosotros-80s.png',
    suit: '♠',
    suitColor: 'text-gray-800',
    icon: Radio,
  },
  {
    year: '1995',
    title: 'La Evolución',
    description: 'La tecnología cambió, pero nuestra esencia rockera se mantuvo firme. Llegamos a más oyentes con nueva energía.',
    image: '/images/nosotros-90s.png',
    suit: '♥',
    suitColor: 'text-red-600',
    icon: Mic2,
  },
  {
    year: '2010',
    title: 'Era Digital',
    description: 'La revolución digital nos impulsó al mundo entero. Streaming, podcasts y más rock para todos.',
    image: '/images/nosotros-2000s.png',
    suit: '♦',
    suitColor: 'text-red-600',
    icon: Headphones,
  },
  {
    year: '2024',
    title: 'Hoy',
    description: 'Más fuertes que nunca. Conectando generaciones a través de la música que nos define.',
    image: '/images/nosotros-2020s.png',
    suit: '♣',
    suitColor: 'text-gray-800',
    icon: Heart,
  },
]

export default function NosotrosSection() {
  return (
    <section id="nosotros" className="py-20 md:py-28 bg-gradient-to-b from-white to-[#FDF2F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B1A2B]/10 rounded-full mb-4">
            <Heart className="w-4 h-4 text-[#8B1A2B]" />
            <span className="text-[#8B1A2B] text-sm font-medium">Nuestra Historia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Nosotros
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Décadas de rock, pasión y música que conecta corazones
          </p>
        </motion.div>

        {/* Poker Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {timelineData.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, rotateZ: index % 2 === 0 ? 2 : -2 }}
                className="poker-card group"
              >
                <div className="poker-card-inner relative">
                  {/* Front of card */}
                  <div className="poker-card-front relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                    {/* Card Corner - Top Left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col items-center">
                      <span className={`text-xl font-bold ${item.suitColor}`}>{item.suit}</span>
                      <span className="text-xs font-bold text-gray-500">{item.year}</span>
                    </div>

                    {/* Card Corner - Top Right */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-center rotate-180">
                      <span className={`text-xl font-bold ${item.suitColor}`}>{item.suit}</span>
                      <span className="text-xs font-bold text-gray-500">{item.year}</span>
                    </div>

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={`Radio Miraflores - ${item.year}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-[#8B1A2B] text-white text-xs font-bold rounded-full">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-4 h-4 text-[#8B1A2B]" />
                        <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                    </div>

                    {/* Card Border Decoration */}
                    <div className="absolute inset-2 border-2 border-dashed border-gray-100 rounded-xl pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '39+', label: 'Años al aire' },
            { value: '50K+', label: 'Oyentes' },
            { value: '100+', label: 'Programas' },
            { value: '∞', label: 'Pasión rockera' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white shadow-sm border border-gray-50">
              <p className="text-2xl md:text-3xl font-extrabold text-[#8B1A2B]">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
