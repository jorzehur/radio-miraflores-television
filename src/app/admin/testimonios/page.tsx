'use client'

import { useEffect, useState } from 'react'

interface Testimonio { id: string; name: string; role: string; quote: string; imageUrl: string | null; rating: number; active: boolean; sortOrder: number }

export default function AdminTestimonios() {
  const [section, setSection] = useState<Record<string, string>>({})
  const [items, setItems] = useState<Testimonio[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', quote: '', imageUrl: '', rating: 5, sortOrder: 0 })

  useEffect(() => {
    fetch('/api/admin/testimonios').then(r => r.json()).then(d => { setSection(d || {}); setItems(d?.items || []) })
  }, [])

  async function handleSaveSection() {
    setSaving(true); setSaved(false)
    const { items: _, ...data } = section as any
    await fetch('/api/admin/testimonios', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  async function handleCreate() {
    await fetch('/api/admin/testimonios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null, active: true }) })
    setForm({ name: '', role: '', quote: '', imageUrl: '', rating: 5, sortOrder: 0 }); setShowForm(false); loadItems()
  }

  async function handleDelete(id: string) { if (!confirm('¿Eliminar?')) return; await fetch(`/api/admin/testimonios/${id}`, { method: 'DELETE' }); loadItems() }
  async function loadItems() { const res = await fetch('/api/admin/testimonios'); const d = await res.json(); setItems(d?.items || []) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">💬 Testimonios</h1>
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
        <h3 className="font-semibold text-gray-700">Testimonios ({items.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium text-sm hover:bg-[#6B0F1E]">{showForm ? 'Cancelar' : '+ Agregar'}</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rol</label><input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" placeholder="Oyente desde 2005" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Testimonio</label><textarea value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" rows={3} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label><input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label><input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: +e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" /></div>
          </div>
          <button onClick={handleCreate} className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Crear</button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{item.name} <span className="text-gray-400 font-normal text-sm">· {item.role}</span></p>
              <p className="text-sm text-gray-500 truncate">{item.quote}</p>
              <p className="text-xs text-yellow-500 mt-1">{'★'.repeat(item.rating)}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
