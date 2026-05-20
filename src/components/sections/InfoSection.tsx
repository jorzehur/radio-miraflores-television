'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contacto@radiomiraflores.tv',
    href: 'mailto:contacto@radiomiraflores.tv',
    color: 'from-[#8B1A2B] to-[#A63346]',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+51 (01) 234-5678',
    href: 'tel:+51012345678',
    color: 'from-[#F5A623] to-[#FFD166]',
  },
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Av. Miraflores 1234, Lima, Perú',
    href: '#',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'Lun - Sáb: 6:00 AM - 12:00 AM',
    href: '#',
    color: 'from-blue-500 to-blue-600',
  },
]

export default function InfoSection() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-gradient-to-b from-white to-[#FDF2F4]">
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
            <span className="text-[#8B1A2B] text-sm font-medium">Encuéntranos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Información
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Estamos aquí para ti. Contáctanos o visítanos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Contact Cards */}
          <div className="space-y-4">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-50 hover:border-[#8B1A2B]/10 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                    <p className="text-gray-800 font-semibold text-sm">{item.value}</p>
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
              className="p-5 bg-gradient-to-br from-[#8B1A2B] to-[#6B0F1E] rounded-xl shadow-lg mt-6"
            >
              <h4 className="text-white font-bold text-lg mb-2">¡Suscríbete!</h4>
              <p className="text-white/70 text-sm mb-4">Recibe las últimas noticias y el ranking semanal</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="px-4 py-2.5 bg-[#F5A623] text-white rounded-lg font-semibold text-sm hover:bg-[#E09520] transition-colors flex items-center gap-1.5">
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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.9648678395777!2d-77.0276!3d-12.1198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b5d35b9b5f%3A0x2cccb8c0be5f1f3!2sMiraflores%2C%20Lima%2C%20Peru!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Ubicación de Radio Miraflores Televisión"
            />
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
