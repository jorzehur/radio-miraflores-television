'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, LogIn, LogOut, Save, Plus, Trash2, Edit3, ChevronRight,
  Home, Trophy, Heart, Newspaper, MessageSquare, Share2, MapPin, FileText,
  Loader2, Check, AlertCircle, Settings, Play, ExternalLink
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface HeroData {
  title: string; titleHighlight: string; subtitle: string
  ctaPrimaryText: string; ctaPrimaryLink: string
  ctaSecondaryText: string; ctaSecondaryLink: string
  backgroundImage: string; overlayColor: string
}

interface RankingItem {
  id: string; position: number; song: string; artist: string
  album: string; weeks: number; trend: string; imageUrl?: string | null
}

interface NosotrosCard {
  id: string; year: string; title: string; description: string
  imageUrl: string; icon: string; sortOrder: number
}

interface NoticiaItem {
  id: string; title: string; excerpt: string | null; content: string | null
  imageUrl: string | null; author: string; facebookEmbedUrl: string | null
  published: boolean; sortOrder: number
}

interface TestimonioItem {
  id: string; name: string; role: string; quote: string
  imageUrl: string | null; rating: number; sortOrder: number
}

interface RedSocial {
  id: string; platform: string; url: string; embedUrl?: string | null; username: string
  followers: string; sortOrder: number
}

interface InfoData {
  address: string; phone: string; email: string
  schedule: string; scheduleWeekend: string; mapUrl: string | null
}

interface FooterData {
  description: string; copyright: string
}

// ─── Admin Sections ──────────────────────────────────────────────────────────
const sections = [
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
  { id: 'nosotros', label: 'Nosotros', icon: Heart },
  { id: 'noticias', label: 'Noticias', icon: Newspaper },
  { id: 'testimonios', label: 'Testimonios', icon: MessageSquare },
  { id: 'redes', label: 'Redes', icon: Share2 },
  { id: 'info', label: 'Información', icon: MapPin },
  { id: 'footer', label: 'Footer', icon: FileText },
  { id: 'video-ranking', label: 'Video Ranking', icon: Play },
]

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  )
}

   // ─── Main Component ──────────────────────────────────────────────────────────
   export default function AdminPanel() {
   const [isOpen, setIsOpen] = useState(false)
   const [isLoggedIn, setIsLoggedIn] = useState(false)
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [activeSection, setActiveSection] = useState('hero')
   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
   const [loading, setLoading] = useState(false)

   // Data states
   const [heroData, setHeroData] = useState<HeroData | null>(null)
   const [rankingData, setRankingData] = useState<RankingItem[]>([])
   const [nosotrosCards, setNosotrosCards] = useState<NosotrosCard[]>([])
   const [noticiasData, setNoticiasData] = useState<NoticiaItem[]>([])
   const [noticiasMaxVisible, setNoticiasMaxVisible] = useState(2)
   const [testimoniosData, setTestimoniosData] = useState<TestimonioItem[]>([])
   const [redesData, setRedesData] = useState<RedSocial[]>([])
   const [infoData, setInfoData] = useState<InfoData | null>(null)
   const [footerData, setFooterData] = useState<FooterData | null>(null)
   const [videoRankingSection, setVideoRankingSection] = useState<Record<string, string>>({})
   const [videoRankingItems, setVideoRankingItems] = useState<{ id: string; title: string; artist: string; youtubeUrl: string; videoId: string; thumbnailUrl: string | null; active: boolean; sortOrder: number; hlsUrl?: string | null; downloadStatus?: string }[]>([])

   // New item form states
   const [newRanking, setNewRanking] = useState({ position: 1, song: '', artist: '', album: '', weeks: 1, trend: 'up' })
   const [newNoticia, setNewNoticia] = useState({ title: '', excerpt: '', facebookEmbedUrl: '', published: true })
   const [newTestimonio, setNewTestimonio] = useState({ name: '', role: '', quote: '', rating: 5 })
   const [newRed, setNewRed] = useState({ platform: 'youtube', url: '', embedUrl: '', username: '', followers: '' })
   const [newVideoRanking, setNewVideoRanking] = useState({ title: '', artist: '', youtubeUrl: '', sortOrder: 0 })
   const [videoRankingError, setVideoRankingError] = useState('')
   const [downloadingId, setDownloadingId] = useState<string | null>(null)

   // Auth and data loading functions
   async function checkAuth() {
     try {
       const res = await fetch('/api/admin/auth/check')
       const data = await res.json()
       setIsLoggedIn(data.authenticated === true)
     } catch { /* ignore */ }
   }

   async function loadSectionData(section: string) {
     try {
       switch (section) {
         case 'hero': {
           const res = await fetch('/api/admin/hero')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d && d.title) setHeroData(d)
           break
         }
         case 'ranking': {
           const res = await fetch('/api/admin/ranking')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (Array.isArray(d)) setRankingData(d)
           break
         }
         case 'nosotros': {
           const res = await fetch('/api/admin/nosotros')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d && Array.isArray(d.cards)) setNosotrosCards(d.cards)
           break
         }
         case 'noticias': {
           const res = await fetch('/api/admin/noticias')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d) {
             if (Array.isArray(d.items)) setNoticiasData(d.items)
             if (d.maxVisible) setNoticiasMaxVisible(d.maxVisible)
           }
           break
         }
         case 'testimonios': {
           const res = await fetch('/api/admin/testimonios')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d && Array.isArray(d.items)) setTestimoniosData(d.items)
           break
         }
         case 'redes': {
           const res = await fetch('/api/admin/redes')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d && Array.isArray(d.items)) setRedesData(d.items)
           break
         }
         case 'info': {
           const res = await fetch('/api/admin/info')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d && d.email) setInfoData(d)
           break
         }
         case 'footer': {
           const res = await fetch('/api/admin/footer')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d && d.description) setFooterData(d)
           break
         }
         case 'video-ranking': {
           const res = await fetch('/api/admin/video-ranking')
           if (!res.ok) throw new Error('No autorizado')
           const d = await res.json()
           if (d) {
             const { items, ...section } = d
             setVideoRankingSection(section)
             if (Array.isArray(items)) setVideoRankingItems(items)
           }
           break
         }
       }
     } catch (err: any) {
       if (err?.message === 'No autorizado') {
         showToast('Sesión expirada. Inicia sesión nuevamente.', 'error')
         setIsLoggedIn(false)
       } else {
         showToast('Error al cargar datos', 'error')
       }
     }
   }

   useEffect(() => {
     (async () => {
       await checkAuth()
     })()
   }, [])

   useEffect(() => {
     if (isLoggedIn && isOpen) {
       (async () => {
         await loadSectionData(activeSection)
       })()
     }
   }, [activeSection, isLoggedIn, isOpen])

  async function handleLogin() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsLoggedIn(true)
        showToast('Sesión iniciada correctamente', 'success')
      } else {
        showToast('Credenciales incorrectas', 'error')
      }
    } catch {
      showToast('Error de conexión', 'error')
    }
    setLoading(false)
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setIsOpen(false)
    } catch { /* ignore */ }
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function apiPut(url: string, body: any) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  }

  async function apiPost(url: string, body: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res
  }

  async function apiDelete(url: string) {
    const res = await fetch(url, { method: 'DELETE' })
    return res.ok
  }

  // ─── Save Handlers ───────────────────────────────────────────────────────
  async function saveHero() {
    if (!heroData) return
    const ok = await apiPut('/api/admin/hero', heroData)
    showToast(ok ? 'Hero guardado' : 'Error al guardar', ok ? 'success' : 'error')
  }

  async function saveRanking() {
    // Update each item individually
    for (const item of rankingData) {
      await apiPut(`/api/admin/ranking/${item.id}`, item)
    }
    showToast('Ranking guardado', 'success')
  }

  async function addRankingItem() {
    const res = await apiPost('/api/admin/ranking', newRanking)
    if (res.ok) {
      const item = await res.json()
      setRankingData([...rankingData, item])
      setNewRanking({ position: rankingData.length + 1, song: '', artist: '', album: '', weeks: 1, trend: 'up' })
      showToast('Canción agregada', 'success')
    } else {
      showToast('Error al agregar', 'error')
    }
  }

  async function deleteRankingItem(id: string) {
    const ok = await apiDelete(`/api/admin/ranking/${id}`)
    if (ok) {
      setRankingData(rankingData.filter(r => r.id !== id))
      showToast('Canción eliminada', 'success')
    }
  }

  async function saveNosotros() {
    for (const card of nosotrosCards) {
      await apiPut(`/api/admin/nosotros/cards/${card.id}`, card)
    }
    showToast('Nosotros guardado', 'success')
  }

  async function saveNoticias() {
    await apiPut('/api/admin/noticias/section', { maxVisible: noticiasMaxVisible })
    for (const item of noticiasData) {
      await apiPut(`/api/admin/noticias/${item.id}`, item)
    }
    showToast('Noticias guardadas', 'success')
  }

  async function addNoticiaItem() {
    const res = await apiPost('/api/admin/noticias', newNoticia)
    if (res.ok) {
      const item = await res.json()
      setNoticiasData([...noticiasData, item])
      setNewNoticia({ title: '', excerpt: '', facebookEmbedUrl: '', published: true })
      showToast('Noticia agregada', 'success')
    } else {
      showToast('Error al agregar', 'error')
    }
  }

  async function deleteNoticiaItem(id: string) {
    const ok = await apiDelete(`/api/admin/noticias/${id}`)
    if (ok) {
      setNoticiasData(noticiasData.filter(n => n.id !== id))
      showToast('Noticia eliminada', 'success')
    }
  }

  async function saveTestimonios() {
    for (const item of testimoniosData) {
      await apiPut(`/api/admin/testimonios/${item.id}`, item)
    }
    showToast('Testimonios guardados', 'success')
  }

  async function addTestimonioItem() {
    const res = await apiPost('/api/admin/testimonios', newTestimonio)
    if (res.ok) {
      const item = await res.json()
      setTestimoniosData([...testimoniosData, item])
      setNewTestimonio({ name: '', role: '', quote: '', rating: 5 })
      showToast('Testimonio agregado', 'success')
    } else {
      showToast('Error al agregar', 'error')
    }
  }

  async function deleteTestimonioItem(id: string) {
    const ok = await apiDelete(`/api/admin/testimonios/${id}`)
    if (ok) {
      setTestimoniosData(testimoniosData.filter(t => t.id !== id))
      showToast('Testimonio eliminado', 'success')
    }
  }

  async function saveRedes() {
    for (const item of redesData) {
      await apiPut(`/api/admin/redes/${item.id}`, item)
    }
    showToast('Redes guardadas', 'success')
  }

  async function addRedItem() {
    const res = await apiPost('/api/admin/redes', newRed)
    if (res.ok) {
      const item = await res.json()
      setRedesData([...redesData, item])
      setNewRed({ platform: 'youtube', url: '', embedUrl: '', username: '', followers: '' })
      showToast('Red social agregada', 'success')
    } else {
      showToast('Error al agregar', 'error')
    }
  }

  async function deleteRedItem(id: string) {
    const ok = await apiDelete(`/api/admin/redes/${id}`)
    if (ok) {
      setRedesData(redesData.filter(r => r.id !== id))
      showToast('Red social eliminada', 'success')
    }
  }

  async function saveInfo() {
    if (!infoData) return
    const ok = await apiPut('/api/admin/info', infoData)
    showToast(ok ? 'Información guardada' : 'Error al guardar', ok ? 'success' : 'error')
  }

  async function saveFooter() {
    if (!footerData) return
    const ok = await apiPut('/api/admin/footer', footerData)
    showToast(ok ? 'Footer guardado' : 'Error al guardar', ok ? 'success' : 'error')
  }

  function extractYouTubeVideoId(input: string) {
    if (!input) return null
    const trimmed = input.trim()
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
    try {
      const url = new URL(trimmed)
      if (url.hostname.includes('youtu.be')) {
        const id = url.pathname.replace('/', '')
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
      }
      if (url.hostname.includes('youtube.com')) {
        const watchId = url.searchParams.get('v')
        if (watchId && /^[a-zA-Z0-9_-]{11}$/.test(watchId)) return watchId
        const parts = url.pathname.split('/').filter(Boolean)
        const candidate = parts[1] && ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : null
        if (candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate)) return candidate
      }
    } catch { /* ignore */ }
    return null
  }

  function buildYouTubeThumbnail(videoId: string) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }

  async function saveVideoRankingSection() {
    const ok = await apiPut('/api/admin/video-ranking', videoRankingSection)
    showToast(ok ? 'Sección guardada' : 'Error al guardar', ok ? 'success' : 'error')
  }

  async function saveVideoRankingItems() {
    for (const item of videoRankingItems) {
      await apiPut(`/api/admin/video-ranking/${item.id}`, item)
    }
    showToast('Videos guardados', 'success')
  }

  async function addVideoRankingItem() {
    const videoId = extractYouTubeVideoId(newVideoRanking.youtubeUrl)
    if (!videoId) {
      setVideoRankingError('URL de YouTube no válida')
      return
    }
    setVideoRankingError('')
    const res = await apiPost('/api/admin/video-ranking', { ...newVideoRanking, active: true })
    if (res.ok) {
      const item = await res.json()
      setVideoRankingItems([...videoRankingItems, item])
      setNewVideoRanking({ title: '', artist: '', youtubeUrl: '', sortOrder: videoRankingItems.length + 1 })
      showToast('Video agregado', 'success')
    } else {
      const body = await res.json().catch(() => null)
      setVideoRankingError(body?.error || 'Error al agregar video')
    }
  }

  async function deleteVideoRankingItem(id: string) {
    const ok = await apiDelete(`/api/admin/video-ranking/${id}`)
    if (ok) {
      setVideoRankingItems(videoRankingItems.filter(item => item.id !== id))
      showToast('Video eliminado', 'success')
    }
  }

  async function toggleVideoRankingActive(id: string, currentActive: boolean) {
    const ok = await apiPut(`/api/admin/video-ranking/${id}`, { active: !currentActive })
    if (ok) {
      setVideoRankingItems(videoRankingItems.map(item => item.id === id ? { ...item, active: !currentActive } : item))
    }
  }

  async function downloadVideo(id: string) {
    setDownloadingId(id)
    const res = await fetch('/api/admin/video-ranking/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (data.success) {
      setVideoRankingItems(videoRankingItems.map(item =>
        item.id === id ? { ...item, hlsUrl: data.hlsUrl, downloadStatus: 'ready' } : item
      ))
      showToast('Video descargado y convertido a HLS', 'success')
    } else {
      setVideoRankingItems(videoRankingItems.map(item =>
        item.id === id ? { ...item, downloadStatus: 'failed', downloadError: data.error } : item
      ))
      showToast(data.error || 'Error al descargar', 'error')
    }
    setDownloadingId(null)
  }

  // ─── Input helper ─────────────────────────────────────────────────────────
  function Input({ label, value, onChange, type = 'text', placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
  }) {
    return (
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A2B]/30 focus:border-[#8B1A2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1A2B]/30 focus-visible:border-[#8B1A2B] outline-none transition-colors"
        />
      </div>
    )
  }

  // ─── Render Section ───────────────────────────────────────────────────────
  function renderSection() {
    switch (activeSection) {
      case 'hero':
        return heroData ? (
          <div className="space-y-4">
            <Input label="Título" value={heroData.title} onChange={v => setHeroData({ ...heroData, title: v })} />
            <Input label="Destaque" value={heroData.titleHighlight} onChange={v => setHeroData({ ...heroData, titleHighlight: v })} />
            <Input label="Subtítulo" value={heroData.subtitle} onChange={v => setHeroData({ ...heroData, subtitle: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Botón 1 Texto" value={heroData.ctaPrimaryText} onChange={v => setHeroData({ ...heroData, ctaPrimaryText: v })} />
              <Input label="Botón 1 Link" value={heroData.ctaPrimaryLink} onChange={v => setHeroData({ ...heroData, ctaPrimaryLink: v })} />
              <Input label="Botón 2 Texto" value={heroData.ctaSecondaryText} onChange={v => setHeroData({ ...heroData, ctaSecondaryText: v })} />
              <Input label="Botón 2 Link" value={heroData.ctaSecondaryLink} onChange={v => setHeroData({ ...heroData, ctaSecondaryLink: v })} />
            </div>
            <Input label="Imagen de fondo (ruta)" value={heroData.backgroundImage} onChange={v => setHeroData({ ...heroData, backgroundImage: v })} placeholder="/images/hero-radio-studio.png" />
            <button onClick={saveHero} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Hero
            </button>
          </div>
        ) : <p className="text-gray-400 text-sm">Cargando...</p>

      case 'ranking':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {rankingData.map((item, i) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8B1A2B]">#{item.position}</span>
                    <button onClick={() => deleteRankingItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors" aria-label="Eliminar canción">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.song} onChange={e => {
                      const updated = [...rankingData]; updated[i] = { ...updated[i], song: e.target.value }; setRankingData(updated)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Canción" />
                    <input value={item.artist} onChange={e => {
                      const updated = [...rankingData]; updated[i] = { ...updated[i], artist: e.target.value }; setRankingData(updated)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Artista" />
                    <input value={item.album} onChange={e => {
                      const updated = [...rankingData]; updated[i] = { ...updated[i], album: e.target.value }; setRankingData(updated)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Álbum" />
                    <select value={item.trend} onChange={e => {
                      const updated = [...rankingData]; updated[i] = { ...updated[i], trend: e.target.value }; setRankingData(updated)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm">
                      <option value="up">↑ Subiendo</option>
                      <option value="same">→ Igual</option>
                      <option value="down">↓ Bajando</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
              <p className="text-xs font-semibold text-blue-700">Agregar canción</p>
              <div className="grid grid-cols-2 gap-2">
                <input value={newRanking.song} onChange={e => setNewRanking({ ...newRanking, song: e.target.value })} className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Canción" />
                <input value={newRanking.artist} onChange={e => setNewRanking({ ...newRanking, artist: e.target.value })} className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Artista" />
                <input value={newRanking.album} onChange={e => setNewRanking({ ...newRanking, album: e.target.value })} className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Álbum" />
                <input value={newRanking.weeks} onChange={e => setNewRanking({ ...newRanking, weeks: parseInt(e.target.value) || 1 })} type="number" className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Semanas" />
              </div>
              <button onClick={addRankingItem} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
            <button onClick={saveRanking} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Ranking
            </button>
          </div>
        )

      case 'nosotros':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {nosotrosCards.map((card, i) => (
                <div key={card.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8B1A2B]">{card.year} - {card.title}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={card.year} onChange={e => {
                      const u = [...nosotrosCards]; u[i] = { ...u[i], year: e.target.value }; setNosotrosCards(u)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Año" />
                    <input value={card.title} onChange={e => {
                      const u = [...nosotrosCards]; u[i] = { ...u[i], title: e.target.value }; setNosotrosCards(u)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Título" />
                  </div>
                  <textarea value={card.description} onChange={e => {
                    const u = [...nosotrosCards]; u[i] = { ...u[i], description: e.target.value }; setNosotrosCards(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" rows={2} placeholder="Descripción" />
                  <input value={card.imageUrl} onChange={e => {
                    const u = [...nosotrosCards]; u[i] = { ...u[i], imageUrl: e.target.value }; setNosotrosCards(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="URL de imagen" />
                </div>
              ))}
            </div>
            <button onClick={saveNosotros} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Nosotros
            </button>
          </div>
        )

      case 'noticias':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-500">Noticias visibles:</label>
              <select value={noticiasMaxVisible} onChange={e => setNoticiasMaxVisible(parseInt(e.target.value))} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm">
                <option value={1}>1 noticia</option>
                <option value={2}>2 noticias</option>
                <option value={3}>3 noticias</option>
                <option value={4}>4 noticias</option>
              </select>
            </div>
            <div className="space-y-3">
              {noticiasData.map((item, i) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8B1A2B] truncate max-w-[180px]">{item.title}</span>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const u = [...noticiasData]; u[i] = { ...u[i], published: !u[i].published }; setNoticiasData(u)
                      }} className={`text-xs px-2 py-0.5 rounded ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.published ? 'Publicado' : 'Borrador'}
                      </button>
                      <button onClick={() => deleteNoticiaItem(item.id)} className="text-red-400 hover:text-red-600" aria-label="Eliminar noticia">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input value={item.title} onChange={e => {
                    const u = [...noticiasData]; u[i] = { ...u[i], title: e.target.value }; setNoticiasData(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Título" />
                  <textarea value={item.excerpt || ''} onChange={e => {
                    const u = [...noticiasData]; u[i] = { ...u[i], excerpt: e.target.value }; setNoticiasData(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" rows={2} placeholder="Extracto" />
                  <input value={item.facebookEmbedUrl || ''} onChange={e => {
                    const u = [...noticiasData]; u[i] = { ...u[i], facebookEmbedUrl: e.target.value || null }; setNoticiasData(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="URL Facebook embed (opcional)" />
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
              <p className="text-xs font-semibold text-blue-700">Agregar noticia</p>
              <input value={newNoticia.title} onChange={e => setNewNoticia({ ...newNoticia, title: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Título" />
              <textarea value={newNoticia.excerpt} onChange={e => setNewNoticia({ ...newNoticia, excerpt: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" rows={2} placeholder="Extracto" />
              <input value={newNoticia.facebookEmbedUrl} onChange={e => setNewNoticia({ ...newNoticia, facebookEmbedUrl: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="URL Facebook embed (opcional)" />
              <button onClick={addNoticiaItem} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
            <button onClick={saveNoticias} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Noticias
            </button>
          </div>
        )

      case 'testimonios':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {testimoniosData.map((item, i) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8B1A2B]">{item.name}</span>
                    <button onClick={() => deleteTestimonioItem(item.id)} className="text-red-400 hover:text-red-600" aria-label="Eliminar testimonio">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.name} onChange={e => {
                      const u = [...testimoniosData]; u[i] = { ...u[i], name: e.target.value }; setTestimoniosData(u)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Nombre" />
                    <input value={item.role} onChange={e => {
                      const u = [...testimoniosData]; u[i] = { ...u[i], role: e.target.value }; setTestimoniosData(u)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Rol" />
                  </div>
                  <textarea value={item.quote} onChange={e => {
                    const u = [...testimoniosData]; u[i] = { ...u[i], quote: e.target.value }; setTestimoniosData(u)
                  }} className="w-full max-w-[500px] px-2 py-1.5 bg-white border border-gray-200 rounded text-sm whitespace-pre-wrap" rows={3} placeholder="Cita" />
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
              <p className="text-xs font-semibold text-blue-700">Agregar testimonio</p>
              <div className="grid grid-cols-2 gap-2">
                <input value={newTestimonio.name} onChange={e => setNewTestimonio({ ...newTestimonio, name: e.target.value })} className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Nombre" />
                <input value={newTestimonio.role} onChange={e => setNewTestimonio({ ...newTestimonio, role: e.target.value })} className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Rol" />
              </div>
              <textarea value={newTestimonio.quote} onChange={e => setNewTestimonio({ ...newTestimonio, quote: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" rows={2} placeholder="Cita" />
              <button onClick={addTestimonioItem} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
            <button onClick={saveTestimonios} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Testimonios
            </button>
          </div>
        )

      case 'redes':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {redesData.map((item, i) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8B1A2B] capitalize">{item.platform}</span>
                    <button onClick={() => deleteRedItem(item.id)} className="text-red-400 hover:text-red-600" aria-label="Eliminar red social">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.url} onChange={e => {
                      const u = [...redesData]; u[i] = { ...u[i], url: e.target.value }; setRedesData(u)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="URL" />
                    <input value={item.username} onChange={e => {
                      const u = [...redesData]; u[i] = { ...u[i], username: e.target.value }; setRedesData(u)
                    }} className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Usuario" />
                  </div>
                  <textarea value={item.embedUrl || ''} onChange={e => {
                    const u = [...redesData]; u[i] = { ...u[i], embedUrl: e.target.value || null }; setRedesData(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm min-h-[60px]" placeholder="URL embed / iframe / HTML (opcional)" />
                  <input value={item.followers} onChange={e => {
                    const u = [...redesData]; u[i] = { ...u[i], followers: e.target.value }; setRedesData(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Seguidores" />
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
              <p className="text-xs font-semibold text-blue-700">Agregar red social</p>
              <select value={newRed.platform} onChange={e => setNewRed({ ...newRed, platform: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm">
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">X (Twitter)</option>
                <option value="tiktok">TikTok</option>
                <option value="spotify">Spotify</option>
              </select>
              <input value={newRed.url} onChange={e => setNewRed({ ...newRed, url: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="URL" />
              <textarea value={newRed.embedUrl} onChange={e => setNewRed({ ...newRed, embedUrl: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm min-h-[60px]" placeholder="URL embed / iframe / HTML (opcional)" />
              <div className="grid grid-cols-2 gap-2">
                <input value={newRed.username} onChange={e => setNewRed({ ...newRed, username: e.target.value })} className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Usuario" />
                <input value={newRed.followers} onChange={e => setNewRed({ ...newRed, followers: e.target.value })} className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Seguidores" />
              </div>
              <button onClick={addRedItem} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
            <button onClick={saveRedes} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Redes
            </button>
          </div>
        )

      case 'info':
        return infoData ? (
          <div className="space-y-4">
            <Input label="Email" value={infoData.email} onChange={v => setInfoData({ ...infoData, email: v })} />
            <Input label="Teléfono" value={infoData.phone} onChange={v => setInfoData({ ...infoData, phone: v })} />
            <Input label="Dirección" value={infoData.address} onChange={v => setInfoData({ ...infoData, address: v })} />
            <Input label="Horario (Lun-Vie)" value={infoData.schedule} onChange={v => setInfoData({ ...infoData, schedule: v })} />
            <Input label="Horario (Sáb-Dom)" value={infoData.scheduleWeekend} onChange={v => setInfoData({ ...infoData, scheduleWeekend: v })} />
            <Input label="URL Mapa Google" value={infoData.mapUrl || ''} onChange={v => setInfoData({ ...infoData, mapUrl: v || null })} />
            <button onClick={saveInfo} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Información
            </button>
          </div>
        ) : <p className="text-gray-400 text-sm">Cargando...</p>

      case 'footer':
        return footerData ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</label>
              <textarea value={footerData.description} onChange={e => setFooterData({ ...footerData, description: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#8B1A2B]/30 focus:border-[#8B1A2B] outline-none" rows={3} />
            </div>
            <Input label="Copyright" value={footerData.copyright} onChange={v => setFooterData({ ...footerData, copyright: v })} />
            <button onClick={saveFooter} className="w-full py-2.5 bg-[#8B1A2B] text-white rounded-lg font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Footer
            </button>
          </div>
        ) : <p className="text-gray-400 text-sm">Cargando...</p>

      case 'video-ranking':
        return (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-[#8B1A2B]">Configuración de la sección</p>
              {['subtitle', 'title', 'description', 'ctaText', 'ctaLink'].map(key => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-gray-500 capitalize">{key === 'ctaText' ? 'Texto del botón' : key === 'ctaLink' ? 'Enlace del botón' : key}</label>
                  <input
                    type="text"
                    value={videoRankingSection[key] || ''}
                    onChange={e => setVideoRankingSection({ ...videoRankingSection, [key]: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#8B1A2B]/30 focus-visible:border-[#8B1A2B]"
                  />
                </div>
              ))}
              <button onClick={saveVideoRankingSection} className="w-full py-2 bg-[#8B1A2B] text-white rounded-lg text-sm font-semibold hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-1">
                <Save className="w-4 h-4" /> Guardar sección
              </button>
            </div>

            <p className="text-xs font-semibold text-[#8B1A2B]">Videos ({videoRankingItems.length})</p>

            <div className="space-y-3">
              {videoRankingItems.map((item, i) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8B1A2B]">#{i + 1}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleVideoRankingActive(item.id, item.active)} className="text-xs text-gray-500 hover:text-gray-700 transition-colors" aria-label={item.active ? 'Ocultar video' : 'Mostrar video'}>
                        {item.active ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button onClick={() => deleteVideoRankingItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors" aria-label="Eliminar video">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {item.thumbnailUrl && (
                      <img src={item.thumbnailUrl} alt={item.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" width={80} height={56} />
                    )}
                    <div className="min-w-0 flex-1 space-y-2">
                      <input value={item.title} onChange={e => {
                        const u = [...videoRankingItems]; u[i] = { ...u[i], title: e.target.value }; setVideoRankingItems(u)
                      }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Título" />
                      <input value={item.artist} onChange={e => {
                        const u = [...videoRankingItems]; u[i] = { ...u[i], artist: e.target.value }; setVideoRankingItems(u)
                      }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="Artista" />
                    </div>
                  </div>
                  <input value={item.youtubeUrl} onChange={e => {
                    const u = [...videoRankingItems]; u[i] = { ...u[i], youtubeUrl: e.target.value }; setVideoRankingItems(u)
                  }} className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm" placeholder="URL de YouTube" />
                  <div className="flex gap-2">
                    <button onClick={saveVideoRankingItems} className="flex-1 py-2 bg-[#8B1A2B] text-white rounded-lg text-sm font-semibold hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-1">
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                    {item.hlsUrl && item.hlsUrl.startsWith('/videos/') ? (
                      <button disabled className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold cursor-default">
                        HLS listo
                      </button>
                    ) : downloadingId === item.id ? (
                      <button disabled className="flex-1 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold cursor-default">
                        <Loader2 className="w-4 h-4 inline animate-spin mr-1" />Convirtiendo...
                      </button>
                    ) : (
                      <button onClick={() => downloadVideo(item.id)} className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">
                        Descargar HLS
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
              <p className="text-xs font-semibold text-blue-700">Agregar video</p>
              <input value={newVideoRanking.title} onChange={e => setNewVideoRanking({ ...newVideoRanking, title: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Título del video" />
              <input value={newVideoRanking.artist} onChange={e => setNewVideoRanking({ ...newVideoRanking, artist: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="Artista / Canal" />
              <input value={newVideoRanking.youtubeUrl} onChange={e => setNewVideoRanking({ ...newVideoRanking, youtubeUrl: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-sm" placeholder="URL de YouTube" />
              {videoRankingError && <p className="text-xs font-medium text-red-600">{videoRankingError}</p>}
              <button onClick={addVideoRankingItem} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating Admin Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[100] w-12 h-12 bg-[#8B1A2B] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#6B0F1E] transition-all duration-300 flex items-center justify-center hover:scale-110 group"
        aria-label="Panel de administración"
      >
        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#8B1A2B]" />
                  Administración
                </h2>
                <div className="flex items-center gap-2">
                  {isLoggedIn && (
                    <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors" aria-label="Cerrar sesión">
                      <LogOut className="w-3 h-3" /> Salir
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Cerrar panel de administración">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {!isLoggedIn ? (
                  /* Login Form */
                  <div className="p-6 space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-[#8B1A2B] rounded-full flex items-center justify-center mx-auto mb-3">
                        <LogIn className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Iniciar Sesión</h3>
                      <p className="text-gray-500 text-sm mt-1">Panel de Administración</p>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B1A2B]/30 focus:border-[#8B1A2B] outline-none"
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B1A2B]/30 focus:border-[#8B1A2B] outline-none"
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      />
                      <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 bg-[#8B1A2B] text-white rounded-xl font-semibold text-sm hover:bg-[#6B0F1E] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                        {loading ? 'Ingresando...' : 'Ingresar'}
                      </button>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">
                      admin@radiomiraflores.com / admin123
                    </p>
                  </div>
                ) : (
                  /* Admin Content */
                  <div className="flex flex-col h-full">
                    {/* Section Tabs */}
                    <div className="flex overflow-x-auto border-b border-gray-100 px-2 py-1 gap-1 scrollbar-hide">
                      {sections.map(s => {
                        const Icon = s.icon
                        return (
                          <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              activeSection === s.id
                                ? 'bg-[#8B1A2B] text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {s.label}
                          </button>
                        )
                      })}
                    </div>

                    {/* Section Content */}
                    <div className="p-4 flex-1">
                      {renderSection()}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </>
  )
}
