'use client'

import { useEffect, useState } from 'react'

export default function AdminHero() {
  const [data, setData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/hero').then(r => r.json()).then(d => setData(d || {}))
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fields = [
    { key: 'title', label: 'Título principal', placeholder: 'Radio Miraflores' },
    { key: 'titleHighlight', label: 'Título destacado', placeholder: 'Televisión' },
    { key: 'subtitle', label: 'Subtítulo', placeholder: 'La estación de rock...' },
    { key: 'ctaPrimaryText', label: 'Botón primario (texto)', placeholder: 'Ver Ranking' },
    { key: 'ctaPrimaryLink', label: 'Botón primario (enlace)', placeholder: '#ranking' },
    { key: 'ctaSecondaryText', label: 'Botón secundario (texto)', placeholder: 'Últimas Noticias' },
    { key: 'ctaSecondaryLink', label: 'Botón secundario (enlace)', placeholder: '#noticias' },
    { key: 'backgroundImage', label: 'Imagen de fondo (URL)', placeholder: '/images/hero-radio-studio.png' },
    { key: 'overlayColor', label: 'Color overlay (clase Tailwind)', placeholder: 'from-[#B3E5FC]/85...' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🎬 Sección Hero</h1>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium hover:bg-[#6B0F1E] transition disabled:opacity-50">
          {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar'}
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type="text"
              value={data[f.key] || ''}
              onChange={e => setData({ ...data, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] focus:border-transparent outline-none"
            />
          </div>
        ))}
      </div>
      {data.backgroundImage && (
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-2">Vista previa de imagen:</p>
          <img src={data.backgroundImage} alt="Preview" className="max-h-40 rounded-lg object-cover" />
        </div>
      )}
    </div>
  )
}
