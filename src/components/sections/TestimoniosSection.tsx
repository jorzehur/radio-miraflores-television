'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Quote, Star } from 'lucide-react'

interface TestimonioItem {
  id: string
  name: string
  role: string
  quote: string
  imageUrl: string | null
  rating: number
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface TestimoniosData {
  id: string
  subtitle: string
  title: string
  description: string
  updatedAt: string
  items: TestimonioItem[]
}

const defaultItems: TestimonioItem[] = [
  {
    id: '1',
    name: 'María García',
    role: 'Oyente desde 2005',
    quote: 'Radio Miraflores Televisión ha sido la banda sonora de mi vida. Desde que la descubrí, cada mañana empieza con la energía que solo el rock y esta radio pueden dar. Los locutores son increíbles, la selección musical es perfecta y me siento parte de una gran familia de rockeros. ¡No puedo imaginar mi día sin sintonizarlos!',
    imageUrl: '/images/testimonio-1.png',
    rating: 5,
    active: true,
    sortOrder: 0,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    role: 'Músico y fan desde 1998',
    quote: 'Como músico, encontrar una radio que realmente entiende el rock es un tesoro. Radio Miraflores no solo reproduce música, sino que vive y respira rock. Han apoyado a bandas locales, han dado espacios a nuevos talentos y su ranking internacional es el más honesto que conozco. Esta radio es el corazón del rock en nuestra ciudad.',
    imageUrl: '/images/testimonio-2.png',
    rating: 5,
    active: true,
    sortOrder: 1,
    createdAt: '',
    updatedAt: '',
  },
]

const defaultData: TestimoniosData = {
  id: 'default',
  subtitle: 'Lo que dicen nuestros oyentes',
  title: 'Testimonios',
  description: 'Historias reales de quienes viven la magia de la radio',
  updatedAt: '',
  items: defaultItems,
}

const colorMap = [
  'from-[#8B1A2B] to-[#A63346]',
  'from-[#F5A623] to-[#FFD166]',
  'from-emerald-500 to-emerald-600',
  'from-blue-500 to-blue-600',
]

export default function TestimoniosSection() {
  const [data, setData] = useState<TestimoniosData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchTestimonios() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch('/api/public/testimonios', {
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

    fetchTestimonios()
    return () => { isMounted = false }
  }, [])

  const items = data.items && data.items.length > 0 ? data.items : defaultItems

  return (
    <section id="testimonios" className="py-20 md:py-28 bg-gradient-to-b from-[#FDF2F4] to-white">
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
            <Quote className="w-4 h-4 text-[#8B1A2B]" />
            <span className="text-[#8B1A2B] text-sm font-medium">{data.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {data.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {data.description}
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((testimonio, index) => {
            const color = colorMap[index % colorMap.length]
            const avatar = testimonio.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            return (
              <motion.div
                key={testimonio.id}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-50 hover:border-[#8B1A2B]/10">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Side */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                      {testimonio.imageUrl ? (
                        <Image
                          src={testimonio.imageUrl}
                          alt={testimonio.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                          <span className="text-white font-bold text-3xl">{avatar}</span>
                        </div>
                      )}
                      {testimonio.imageUrl && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
                      )}
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-5 md:p-6">
                      {/* Quote Icon */}
                      <Quote className="w-8 h-8 text-[#8B1A2B]/20 mb-3" />

                      {/* Testimonial Text */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        &ldquo;{testimonio.quote}&rdquo;
                      </p>

                      {/* Rating */}
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(testimonio.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                        ))}
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                          <span className="text-white font-bold text-xs">{avatar}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{testimonio.name}</p>
                          <p className="text-gray-400 text-xs">{testimonio.role}</p>
                        </div>
                      </div>
                    </div>
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
