'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({})

  useEffect(() => {
    async function loadStats() {
      try {
        const [videoRanking, ranking, noticias, testimonios, redes] = await Promise.all([
          fetch('/api/admin/video-ranking').then(r => r.json()),
          fetch('/api/admin/ranking').then(r => r.json()),
          fetch('/api/admin/noticias').then(r => r.json()),
          fetch('/api/admin/testimonios').then(r => r.json()),
          fetch('/api/admin/redes').then(r => r.json()),
        ])
        setStats({
          videoRanking: Array.isArray(videoRanking?.items) ? videoRanking.items.length : 0,
          ranking: Array.isArray(ranking) ? ranking.length : 0,
          noticias: Array.isArray(noticias?.items) ? noticias.items.length : 0,
          testimonios: Array.isArray(testimonios?.items) ? testimonios.items.length : 0,
          redes: Array.isArray(redes?.items) ? redes.items.length : 0,
        })
      } catch {}
    }
    loadStats()
  }, [])

  const cards = [
    { label: 'Hero', icon: '🎬', href: '/admin/hero', color: 'from-blue-500 to-blue-600' },
    { label: 'Video Ranking', icon: '📺', href: '/admin/video-ranking', count: stats.videoRanking, color: 'from-rose-500 to-pink-600' },
    { label: 'Ranking', icon: '🏆', href: '/admin/ranking', count: stats.ranking, color: 'from-yellow-500 to-amber-600' },
    { label: 'Nosotros', icon: '❤️', href: '/admin/nosotros', color: 'from-pink-500 to-rose-600' },
    { label: 'Noticias', icon: '📰', href: '/admin/noticias', count: stats.noticias, color: 'from-green-500 to-emerald-600' },
    { label: 'Testimonios', icon: '💬', href: '/admin/testimonios', count: stats.testimonios, color: 'from-purple-500 to-violet-600' },
    { label: 'Redes Sociales', icon: '📱', href: '/admin/redes', count: stats.redes, color: 'from-cyan-500 to-teal-600' },
    { label: 'Información', icon: '📍', href: '/admin/info', color: 'from-orange-500 to-red-600' },
    { label: 'Footer', icon: '📄', href: '/admin/footer', color: 'from-gray-500 to-gray-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard - Radio Miraflores TV</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <h3 className="font-semibold text-gray-900">{card.label}</h3>
            {card.count !== undefined && (
              <p className="text-sm text-gray-500">{card.count} elemento{card.count !== 1 ? 's' : ''}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
