'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Quote, Star } from 'lucide-react'

const testimoniosData = [
  {
    id: 1,
    name: 'María García',
    role: 'Oyente desde 2005',
    avatar: 'MG',
    testimonial: 'Radio Miraflores Televisión ha sido la banda sonora de mi vida. Desde que la descubrí, cada mañana empieza con la energía que solo el rock y esta radio pueden dar. Los locutores son increíbles, la selección musical es perfecta y me siento parte de una gran familia de rockeros. ¡No puedo imaginar mi día sin sintonizarlos!',
    rating: 5,
    image: '/images/testimonio-1.png',
    color: 'from-[#8B1A2B] to-[#A63346]',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    role: 'Músico y fan desde 1998',
    avatar: 'CM',
    testimonial: 'Como músico, encontrar una radio que realmente entiende el rock es un tesoro. Radio Miraflores no solo reproduce música, sino que vive y respira rock. Han apoyado a bandas locales, han dado espacios a nuevos talentos y su ranking internacional es el más honesto que conozco. Esta radio es el corazón del rock en nuestra ciudad.',
    rating: 5,
    image: '/images/testimonio-2.png',
    color: 'from-[#F5A623] to-[#FFD166]',
  },
]

export default function TestimoniosSection() {
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
            <span className="text-[#8B1A2B] text-sm font-medium">Lo que dicen nuestros oyentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Testimonios
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Historias reales de quienes viven la magia de la radio
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimoniosData.map((testimonio, index) => (
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
                    <Image
                      src={testimonio.image}
                      alt={testimonio.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-5 md:p-6">
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-[#8B1A2B]/20 mb-3" />

                    {/* Testimonial Text */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      &ldquo;{testimonio.testimonial}&rdquo;
                    </p>

                    {/* Rating */}
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(testimonio.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonio.color} flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-xs">{testimonio.avatar}</span>
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
          ))}
        </div>
      </div>
    </section>
  )
}
