'use client'

import { useEffect, useState } from 'react'

export default function AdminInfo() {
  const [data, setData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetch('/api/admin/info').then(r => r.json()).then(d => setData(d || {})) }, [])

  async function handleSave() {
    setSaving(true); setSaved(false)
    await fetch('/api/admin/info', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const fields = [
    { key: 'subtitle', label: 'Subtítulo' }, { key: 'title', label: 'Título' }, { key: 'description', label: 'Descripción' },
    { key: 'address', label: 'Dirección' }, { key: 'phone', label: 'Teléfono' }, { key: 'email', label: 'Email' },
    { key: 'schedule', label: 'Horario (Lun-Vie)' }, { key: 'scheduleWeekend', label: 'Horario (Fines de semana)' },
    { key: 'mapUrl', label: 'URL Google Maps (embed)' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📍 Información</h1>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium hover:bg-[#6B0F1E] transition disabled:opacity-50">
          {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar'}
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input type="text" value={data[f.key] || ''} onChange={e => setData({...data, [f.key]: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" />
          </div>
        ))}
      </div>
    </div>
  )
}
