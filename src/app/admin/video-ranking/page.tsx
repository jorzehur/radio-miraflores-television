'use client'

import { useEffect, useState } from 'react'
import { buildYouTubeThumbnail, extractYouTubeVideoId } from '@/lib/youtube'

interface VideoItem {
  id: string
  title: string
  artist: string
  youtubeUrl: string
  videoId: string
  thumbnailUrl: string | null
  active: boolean
  sortOrder: number
}

export default function AdminVideoRanking() {
  const [section, setSection] = useState<Record<string, string>>({})
  const [items, setItems] = useState<VideoItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', artist: '', youtubeUrl: '', sortOrder: 0 })
  const [error, setError] = useState('')
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const res = await fetch('/api/admin/video-ranking')
    const data = await res.json()
    setSection(data || {})
    setItems(data?.items || [])
  }

  async function handleSaveSection() {
    setSaving(true)
    setSaved(false)
    const { items: _items, ...data } = section as any
    await fetch('/api/admin/video-ranking', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleCreate() {
    const videoId = extractYouTubeVideoId(form.youtubeUrl)
    if (!videoId) {
      setError('La URL de YouTube no es valida.')
      return
    }

    setError('')
    await fetch('/api/admin/video-ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, active: true }),
    })

    setForm({ title: '', artist: '', youtubeUrl: '', sortOrder: items.length + 1 })
    setShowForm(false)
    setPreviewVideoId(null)
    loadData()
  }

  async function handleUpdate(id: string, data: Partial<VideoItem>) {
    const res = await fetch(`/api/admin/video-ranking/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error || 'No se pudo guardar el video.')
      return
    }

    setError('')
    loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este video del ranking?')) return
    await fetch(`/api/admin/video-ranking/${id}`, { method: 'DELETE' })
    loadData()
  }

  async function toggleActive(item: VideoItem) {
    await handleUpdate(item.id, { active: !item.active })
  }

  function handleUrlChange(url: string) {
    setForm({ ...form, youtubeUrl: url })
    const videoId = extractYouTubeVideoId(url)
    setPreviewVideoId(videoId)
  }

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📺 Video Ranking</h1>
          <p className="mt-1 text-sm text-gray-500">Playlist continua para la home. Recomendado: 10 videos o mas.</p>
        </div>
        <button onClick={handleSaveSection} disabled={saving} className="rounded-lg bg-[#8B1A2B] px-6 py-2 text-white font-medium hover:bg-[#6B0F1E] transition disabled:opacity-50">
          {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar sección'}
        </button>
      </div>

      <div className="mb-6 space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {[
          ['subtitle', 'Subtítulo'],
          ['title', 'Título'],
          ['description', 'Descripción'],
          ['ctaText', 'Texto del botón'],
          ['ctaLink', 'Enlace del botón'],
        ].map(([key, label]) => (
          <div key={key} className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              value={section[key] || ''}
              onChange={e => setSection({ ...section, [key]: e.target.value })}
              className="w-full rounded-lg border px-4 py-2.5 outline-none"
            />
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-700">Videos ({items.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-[#8B1A2B] px-4 py-2 text-sm font-medium text-white hover:bg-[#6B0F1E]">
          {showForm ? 'Cancelar' : '+ Agregar video'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Título</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border px-4 py-2.5 outline-none" placeholder="Bohemian Rhapsody" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Artista / Canal</label>
              <input value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} className="w-full rounded-lg border px-4 py-2.5 outline-none" placeholder="Queen" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">URL de YouTube</label>
              <input value={form.youtubeUrl} onChange={e => handleUrlChange(e.target.value)} className="w-full rounded-lg border px-4 py-2.5 outline-none" placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Orden</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} className="w-full rounded-lg border px-4 py-2.5 outline-none" />
            </div>
          </div>
          {previewVideoId && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-green-600">✅ Video detectado: {previewVideoId}</p>
              <img
                src={`https://img.youtube.com/vi/${previewVideoId}/maxresdefault.jpg`}
                alt="Vista previa"
                className="w-48 rounded-lg border border-gray-200"
              />
            </div>
          )}
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
          <button onClick={handleCreate} className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 transition">
            Crear video
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="w-full max-w-[220px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                <img
                  src={item.thumbnailUrl || buildYouTubeThumbnail(item.videoId)}
                  alt={item.title}
                  className="aspect-video w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.artist || 'Sin artista'}</p>
                    <p className="mt-1 text-xs text-gray-400">Video ID: {item.videoId}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => toggleActive(item)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${item.active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                      {item.active ? 'Ocultar' : 'Mostrar'}
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700 hover:bg-red-200">
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Título</label>
                    <input value={item.title} onChange={e => setItems(prev => prev.map(it => it.id === item.id ? { ...it, title: e.target.value } : it))} className="w-full rounded-lg border px-4 py-2.5 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Artista / Canal</label>
                    <input value={item.artist} onChange={e => setItems(prev => prev.map(it => it.id === item.id ? { ...it, artist: e.target.value } : it))} className="w-full rounded-lg border px-4 py-2.5 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">URL de YouTube</label>
                    <input value={item.youtubeUrl} onChange={e => setItems(prev => prev.map(it => it.id === item.id ? { ...it, youtubeUrl: e.target.value } : it))} className="w-full rounded-lg border px-4 py-2.5 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Orden</label>
                    <input type="number" value={item.sortOrder} onChange={e => setItems(prev => prev.map(it => it.id === item.id ? { ...it, sortOrder: Number(e.target.value) || 0 } : it))} className="w-full rounded-lg border px-4 py-2.5 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => handleUpdate(item.id, { title: item.title, artist: item.artist, youtubeUrl: item.youtubeUrl, sortOrder: item.sortOrder, active: item.active })} className="rounded-lg bg-[#8B1A2B] px-4 py-2 text-sm font-medium text-white hover:bg-[#6B0F1E]">
                    Guardar video
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
