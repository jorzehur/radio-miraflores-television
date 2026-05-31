'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Mic2, Radio, Headphones, Quote } from 'lucide-react'

interface NosotrosCard {
  id: string
  year: string
  title: string
  description: string
  imageUrl: string
  icon: string
  sortOrder: number
  active: boolean
  updatedAt: string
}

interface NosotrosData {
  id: string
  subtitle: string
  title: string
  description: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Value: string
  stat3Label: string
  stat4Value: string
  stat4Label: string
  updatedAt: string
  cards: NosotrosCard[]
}

const defaultCards: NosotrosCard[] = [
  { id: '1', year: '1985', title: 'Los Inicios', description: 'Donde todo comenzó. Una pequeña cabina con grandes sueños y la pasión por el rock que nos unió.', imageUrl: '/images/nosotros-80s.png', icon: 'radio', sortOrder: 0, active: true, updatedAt: '' },
  { id: '2', year: '1995', title: 'La Evolución', description: 'La tecnología cambió, pero nuestra esencia rockera se mantuvo firme. Llegamos a más oyentes con nueva energía.', imageUrl: '/images/nosotros-90s.png', icon: 'mic', sortOrder: 1, active: true, updatedAt: '' },
  { id: '3', year: '2010', title: 'Era Digital', description: 'La revolución digital nos impulsó al mundo entero. Streaming, podcasts y más rock para todos.', imageUrl: '/images/nosotros-2000s.png', icon: 'headphones', sortOrder: 2, active: true, updatedAt: '' },
  { id: '4', year: '2024', title: 'Hoy', description: 'Más fuertes que nunca. Conectando generaciones a través de la música que nos define.', imageUrl: '/images/nosotros-2020s.png', icon: 'heart', sortOrder: 3, active: true, updatedAt: '' },
]

const defaultData: NosotrosData = {
  id: 'default',
  subtitle: 'Nuestra Historia',
  title: 'Nosotros',
  description: 'Décadas de rock, pasión y música que conecta corazones',
  stat1Value: '39+', stat1Label: 'Años al aire',
  stat2Value: '50K+', stat2Label: 'Oyentes',
  stat3Value: '100+', stat3Label: 'Programas',
  stat4Value: '∞', stat4Label: 'Pasión rockera',
  updatedAt: '',
  cards: defaultCards,
}

const iconMap: Record<string, any> = { radio: Radio, mic: Mic2, headphones: Headphones, heart: Heart }
const suitMap = ['♠', '♥', '♦', '♣']
const suitColorMap = ['text-gray-800', 'text-red-600', 'text-red-600', 'text-gray-800']

export default function NosotrosSection({ initialData }: { initialData?: NosotrosData | null }) {
  const [data, setData] = useState<NosotrosData>(initialData ?? defaultData)
  const [isLoading, setIsLoading] = useState(!initialData)

  useEffect(() => {
    if (initialData) return
    let isMounted = true

    async function fetchNosotros() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch('/api/public/nosotros', {
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

    fetchNosotros()
    return () => { isMounted = false }
  }, [])

  const cards = data.cards && data.cards.length > 0 ? data.cards : defaultCards
  const stats = [
    { value: data.stat1Value, label: data.stat1Label },
    { value: data.stat2Value, label: data.stat2Label },
    { value: data.stat3Value, label: data.stat3Label },
    { value: data.stat4Value, label: data.stat4Label },
  ]

  return (
    <section id="nosotros" className="py-20 md:py-28 bg-gradient-to-b from-[#FFF9F2] via-white to-[#FFF0F2]">
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
            <span className="text-[#8B1A2B] text-sm font-medium">{data.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {data.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {data.description}
          </p>
        </motion.div>

        {/* Poker Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Radio
            const suit = suitMap[index % suitMap.length]
            const suitColor = suitColorMap[index % suitColorMap.length]
            return (
              <motion.div
                key={item.id || item.year}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, rotateZ: index % 2 === 0 ? 2 : -2 }}
                className="poker-card group"
              >
                <div className="poker-card-inner relative">
                  {/* Front of card */}
                  <div className="poker-card-front relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    {/* Card Corner - Top Left */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col items-center">
                      <span className={`text-xl font-bold ${suitColor}`}>{suit}</span>
                      <span className="text-xs font-bold text-gray-500">{item.year}</span>
                    </div>

                    {/* Card Corner - Top Right */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-center rotate-180">
                      <span className={`text-xl font-bold ${suitColor}`}>{suit}</span>
                      <span className="text-xs font-bold text-gray-500">{item.year}</span>
                    </div>

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.imageUrl || `/images/nosotros-default.png`}
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
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="text-center p-5 rounded-xl bg-white/80 backdrop-blur-md shadow-md border border-white hover:border-[#8B1A2B]/20 hover:shadow-lg transition-all duration-300"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-[#8B1A2B]">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
