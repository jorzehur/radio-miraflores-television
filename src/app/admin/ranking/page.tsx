'use client'

import { useEffect, useState } from 'react'

interface RankingItem { id: string; position: number; song: string; artist: string; album: string; weeks: number; trend: string; imageUrl: string | null; active: boolean }

export default function AdminRanking() {
  const [items, setItems] = useState<RankingItem[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ position: 0, song: '', artist: '', album: '', weeks: 1, trend: 'same', imageUrl: '' })

  useEffect(() => { loadItems() }, [])

  async function loadItems() {
    const res = await fetch('/api/admin/ranking')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  async function handleCreate() {
    await fetch('/api/admin/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null, active: true }),
    })
    setForm({ position: 0, song: '', artist: '', album: '', weeks: 1, trend: 'same', imageUrl: '' })
    setShowForm(false)
    loadItems()
  }

  async function handleUpdate(id: string, data: Partial<RankingItem>) {
    await fetch(`/api/admin/ranking/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEditing(null)
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta canción del ranking?')) return
    await fetch(`/api/admin/ranking/${id}`, { method: 'DELETE' })
    loadItems()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🏆 Ranking Internacional</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium hover:bg-[#6B0F1E] transition">
          {showForm ? 'Cancelar' : '+ Agregar Canción'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-semibold mb-4">Nueva Canción</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
              <input type="number" value={form.position} onChange={e => setForm({...form, position: +e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canción</label>
              <input type="text" value={form.song} onChange={e => setForm({...form, song: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none" placeholder="Bohemian Rhapsody" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Artista</label>
              <input type="text" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none" placeholder="Queen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Álbum</label>
              <input type="text" value={form.album} onChange={e => setForm({...form, album: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semanas en ranking</label>
              <input type="number" value={form.weeks} onChange={e => setForm({...form, weeks: +e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tendencia</label>
              <select value={form.trend} onChange={e => setForm({...form, trend: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none">
                <option value="up">↑ Subiendo</option>
                <option value="down">↓ Bajando</option>
                <option value="same">→ Igual</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL imagen portada</label>
              <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none" placeholder="/images/uploads/..." />
            </div>
          </div>
          <button onClick={handleCreate} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
            Crear Canción
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1A2B] to-[#A63346] flex items-center justify-center text-white font-bold flex-shrink-0">
              #{item.position}
            </div>
            <div className="flex-1 min-w-0">
              {editing === item.id ? (
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" defaultValue={item.position} onChange={e => item.position = +e.target.value} className="px-3 py-1.5 border rounded-lg text-sm" placeholder="Posición" />
                  <input type="text" defaultValue={item.song} onChange={e => item.song = e.target.value} className="px-3 py-1.5 border rounded-lg text-sm" placeholder="Canción" />
                  <input type="text" defaultValue={item.artist} onChange={e => item.artist = e.target.value} className="px-3 py-1.5 border rounded-lg text-sm" placeholder="Artista" />
                  <input type="text" defaultValue={item.album} onChange={e => item.album = e.target.value} className="px-3 py-1.5 border rounded-lg text-sm" placeholder="Álbum" />
                </div>
              ) : (
                <>
                  <p className="font-semibold text-gray-900 truncate">{item.song}</p>
                  <p className="text-sm text-gray-500">{item.artist} {item.album && `· ${item.album}`} · {item.weeks} sem.</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editing === item.id ? (
                <button onClick={() => handleUpdate(item.id, item)} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">✓</button>
              ) : (
                <>
                  <button onClick={() => setEditing(item.id)} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">Editar</button>
                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200">Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
