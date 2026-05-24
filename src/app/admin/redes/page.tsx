'use client'

import { useEffect, useState } from 'react'

interface Red { id: string; platform: string; url: string; username: string; followers: string; active: boolean; sortOrder: number }

const platformIcons: Record<string, string> = { facebook: '📘', instagram: '📸', tiktok: '🎵', youtube: '▶️', twitter: '🐦', spotify: '🎧' }

export default function AdminRedes() {
  const [section, setSection] = useState<Record<string, string>>({})
  const [items, setItems] = useState<Red[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ platform: 'facebook', url: '', username: '', followers: '', sortOrder: 0 })

  useEffect(() => {
    fetch('/api/admin/redes').then(r => r.json()).then(d => { setSection(d || {}); setItems(d?.items || []) })
  }, [])

  async function handleSaveSection() {
    setSaving(true); setSaved(false)
    const { items: _, ...data } = section as any
    await fetch('/api/admin/redes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  async function handleCreate() {
    await fetch('/api/admin/redes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, active: true }) })
    setForm({ platform: 'facebook', url: '', username: '', followers: '', sortOrder: 0 }); setShowForm(false); loadItems()
  }

  async function handleDelete(id: string) { if (!confirm('¿Eliminar?')) return; await fetch(`/api/admin/redes/${id}`, { method: 'DELETE' }); loadItems() }
  async function loadItems() { const res = await fetch('/api/admin/redes'); const d = await res.json(); setItems(d?.items || []) }

  async function handleToggleActive(id: string, currentActive: boolean) {
    await fetch(`/api/admin/redes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !currentActive })
    })
    loadItems()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📱 Redes Sociales</h1>
        <button onClick={handleSaveSection} disabled={saving} className="px-6 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium hover:bg-[#6B0F1E] transition disabled:opacity-50">
          {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
        {['subtitle', 'title', 'description'].map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key === 'subtitle' ? 'Subtítulo' : key === 'title' ? 'Título' : 'Descripción'}</label>
            <input type="text" value={section[key] || ''} onChange={e => setSection({...section, [key]: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Redes ({items.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium text-sm hover:bg-[#6B0F1E]">{showForm ? 'Cancelar' : '+ Agregar Red'}</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label><select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none"><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="youtube">YouTube</option><option value="twitter">Twitter/X</option><option value="spotify">Spotify</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">URL</label><input type="text" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" placeholder="https://facebook.com/..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" placeholder="@radiomiraflores" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Seguidores</label><input type="text" value={form.followers} onChange={e => setForm({...form, followers: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" placeholder="50K seguidores" /></div>
          </div>
          <button onClick={handleCreate} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Agregar</button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <span className="text-2xl">{platformIcons[item.platform] || '🌐'}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 capitalize">
                {item.platform}{' '}
                <span className="text-gray-400 font-normal text-sm">{item.username}</span>
                {!item.active && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md">
                    Oculto
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500 truncate">{item.url}</p>
              <p className="text-xs text-green-600">{item.followers}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToggleActive(item.id, item.active)} 
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                  item.active 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200/50' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                {item.active ? '👁️ Ocultar' : '👁️ Mostrar'}
              </button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
