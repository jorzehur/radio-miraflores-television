'use client'

import { useEffect, useState } from 'react'

interface Noticia { id: string; title: string; excerpt: string; content: string; imageUrl: string | null; author: string; facebookEmbedUrl: string | null; published: boolean; sortOrder: number }

export default function AdminNoticias() {
  const [section, setSection] = useState<Record<string, any>>({})
  const [items, setItems] = useState<Noticia[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', imageUrl: '', author: 'Radio Miraflores TV', facebookEmbedUrl: '', published: true, sortOrder: 0 })

  useEffect(() => {
    fetch('/api/admin/noticias').then(r => r.json()).then(d => {
      setSection(d || {}); setItems(d?.items || [])
    })
  }, [])

  async function handleSaveSection() {
    setSaving(true); setSaved(false)
    await fetch('/api/admin/noticias', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subtitle: section.subtitle, title: section.title, description: section.description, maxVisible: +section.maxVisible }) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  async function handleCreate() {
    await fetch('/api/admin/noticias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null, facebookEmbedUrl: form.facebookEmbedUrl || null }) })
    setForm({ title: '', excerpt: '', content: '', imageUrl: '', author: 'Radio Miraflores TV', facebookEmbedUrl: '', published: true, sortOrder: 0 })
    setShowForm(false); loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta noticia?')) return
    await fetch(`/api/admin/noticias/${id}`, { method: 'DELETE' }); loadItems()
  }

  async function handleTogglePublish(id: string, published: boolean) {
    await fetch(`/api/admin/noticias/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !published }) }); loadItems()
  }

  async function loadItems() {
    const res = await fetch('/api/admin/noticias'); const d = await res.json(); setItems(d?.items || [])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📰 Noticias</h1>
        <button onClick={handleSaveSection} disabled={saving} className="px-6 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium hover:bg-[#6B0F1E] transition disabled:opacity-50">
          {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar Config'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Configuración</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label><input type="text" value={section.subtitle || ''} onChange={e => setSection({...section, subtitle: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Título</label><input type="text" value={section.title || ''} onChange={e => setSection({...section, title: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><input type="text" value={section.description || ''} onChange={e => setSection({...section, description: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Noticias visibles en página</label><input type="number" min="1" max="10" value={section.maxVisible || 2} onChange={e => setSection({...section, maxVisible: +e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Noticias ({items.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium text-sm hover:bg-[#6B0F1E]">
          {showForm ? 'Cancelar' : '+ Nueva Noticia'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Título</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Resumen</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label><input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook Embed URL (opcional)</label><input type="text" value={form.facebookEmbedUrl} onChange={e => setForm({...form, facebookEmbedUrl: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
            </div>
          </div>
          <button onClick={handleCreate} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Crear Noticia</button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.published ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{item.title}</p>
              <p className="text-sm text-gray-500">{item.facebookEmbedUrl ? '📘 Facebook' : '📝 Texto'} · {item.author}</p>
            </div>
            <button onClick={() => handleTogglePublish(item.id, item.published)} className={`px-3 py-1.5 text-sm rounded-lg ${item.published ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
              {item.published ? 'Ocultar' : 'Publicar'}
            </button>
            <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
