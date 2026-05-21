'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/hero', label: 'Hero', icon: '🎬' },
  { href: '/admin/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/admin/nosotros', label: 'Nosotros', icon: '❤️' },
  { href: '/admin/noticias', label: 'Noticias', icon: '📰' },
  { href: '/admin/testimonios', label: 'Testimonios', icon: '💬' },
  { href: '/admin/redes', label: 'Redes Sociales', icon: '📱' },
  { href: '/admin/info', label: 'Información', icon: '📍' },
  { href: '/admin/footer', label: 'Footer', icon: '📄' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }
    fetch('/api/admin/auth/check')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [pathname, router])

  async function handleLogout() {
    document.cookie = 'admin_token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!authenticated) return null

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-[#8B1A2B] to-[#6B0F1E] text-white transition-all duration-300 flex flex-col min-h-screen fixed left-0 top-0 z-40`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sm">RM</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold text-sm">Radio Miraflores</p>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white/70 hover:text-white text-sm w-full"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-16'} flex-1 transition-all duration-300`}>
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <h2 className="font-semibold text-gray-700">
            {menuItems.find(i => i.href === pathname)?.label || 'Dashboard'}
          </h2>
          <div />
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
