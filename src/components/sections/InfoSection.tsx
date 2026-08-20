'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

interface InfoData {
  id: string
  subtitle: string
  title: string
  description: string
  address: string
  phone: string
  email: string
  schedule: string
  scheduleWeekend: string
  mapUrl: string | null
  updatedAt: string
}

const defaultData: InfoData = {
  id: 'default',
  subtitle: 'Encuéntranos',
  title: 'Información',
  description: 'Estamos aquí para ti. Contáctanos o visítanos',
  address: 'Av. Miraflores 1234, Lima, Perú',
  phone: '+51 (01) 234-5678',
  email: 'contacto@radiomiraflores.tv',
  schedule: 'Lun - Sáb: 6:00 AM - 12:00 AM',
  scheduleWeekend: 'Dom: 8:00 AM - 10:00 PM',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.9648678395777!2d-77.0276!3d-12.1198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b5d35b9b5f%3A0x2cccb8c0be5f1f3!2sMiraflores%2C%20Lima%2C%20Peru!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe',
  updatedAt: '',
}

const contactCards = [
  { icon: Mail, label: 'Email', color: 'from-[#8B1A2B] to-[#A63346]', field: 'email' as const, prefix: 'mailto:' },
  { icon: Phone, label: 'Teléfono', color: 'from-[#F5A623] to-[#FFD166]', field: 'phone' as const, prefix: 'tel:' },
  { icon: MapPin, label: 'Dirección', color: 'from-emerald-500 to-emerald-600', field: 'address' as const, prefix: '' },
  { icon: Clock, label: 'Horario', color: 'from-blue-500 to-blue-600', field: 'schedule' as const, prefix: '' },
]

export default function InfoSection({ initialData }: { initialData?: InfoData | null }) {
  const data = initialData ?? defaultData

  return (
    <section id="contacto" className="py-20 md:py-28 bg-gradient-to-b from-[#FFF9F2] via-white to-[#FFF0F2]">
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
            <MapPin className="w-4 h-4 text-[#8B1A2B]" />
            <span className="text-[#8B1A2B] text-sm font-semibold">{data.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {data.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
            {data.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Contact Cards */}
          <div className="space-y-4">
            {contactCards.map((item, index) => {
              const IconComponent = item.icon
              const value = data[item.field] || ''
              const href = item.prefix ? `${item.prefix}${value}` : '#'
              const isSchedule = item.field === 'schedule'
              const displayValue = isSchedule && data.scheduleWeekend
                ? `${value} | ${data.scheduleWeekend}`
                : value
              return (
                <motion.a
                  key={item.label}
                  href={href}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-gray-100 hover:border-[#8B1A2B]/20 transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">{item.label}</p>
                    <p className="text-gray-800 font-bold text-sm">{displayValue}</p>
                  </div>
                </motion.a>
              )
            })}

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-gradient-to-br from-[#8B1A2B] to-[#A63346] rounded-xl shadow-xl shadow-[#8B1A2B]/10 mt-6"
            >
              <h4 className="text-white font-extrabold text-xl mb-1.5">¡Suscríbete!</h4>
              <p className="text-white/80 text-sm mb-4 font-medium">Recibe las últimas noticias y el ranking semanal directamente en tu email</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="px-5 py-2.5 bg-[#F5A623] hover:bg-[#FFD166] hover:text-[#8B1A2B] text-white rounded-lg font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right - Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[400px] lg:h-full min-h-[400px]"
          >
            {data.mapUrl ? (
              <iframe
                src={data.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Ubicación de Radio Miraflores Televisión"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Mapa no disponible</p>
                </div>
              </div>
            )}
            {/* Map Overlay with pin */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8B1A2B]" />
                <span className="text-sm font-semibold text-gray-800">Radio Miraflores TV</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
