'use client'

import { useEffect, useState, useRef } from 'react'

interface Card { id: string; year: string; title: string; description: string; imageUrl: string; icon: string; sortOrder: number; active: boolean }

export default function AdminNosotros() {
  const [section, setSection] = useState<Record<string, string>>({})
  const [cards, setCards] = useState<Card[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [cardForm, setCardForm] = useState({ year: '', title: '', description: '', imageUrl: '/images/nosotros-80s.png', icon: 'radio', sortOrder: 0 })
  const [editing, setEditing] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/nosotros').then(r => r.json()).then(d => {
      setSection(d || {})
      setCards(d?.cards || [])
    })
  }, [])

  async function handleSaveSection() {
    setSaving(true); setSaved(false)
    const { cards: _, ...data } = section as any
    await fetch('/api/admin/nosotros', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  async function handleUpload(file: File): Promise<string | null> {
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = await res.json()
      return data.url || null
    } finally {
      setUploading(false)
    }
  }

  async function handleCreateCard() {
    await fetch('/api/admin/nosotros/cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...cardForm, active: true }) })
    setCardForm({ year: '', title: '', description: '', imageUrl: '/images/nosotros-80s.png', icon: 'radio', sortOrder: 0 })
    setShowCardForm(false)
    const res = await fetch('/api/admin/nosotros'); const d = await res.json(); setCards(d?.cards || [])
  }

  async function handleUpdateCard(id: string, data: Partial<Card>) {
    await fetch(`/api/admin/nosotros/cards/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setEditing(null)
    const res = await fetch('/api/admin/nosotros'); const d = await res.json(); setCards(d?.cards || [])
  }

  async function handleDeleteCard(id: string) {
    if (!confirm('¿Eliminar esta tarjeta?')) return
    await fetch(`/api/admin/nosotros/cards/${id}`, { method: 'DELETE' })
    setCards(cards.filter(c => c.id !== id))
  }

  const sectionFields = [
    { key: 'subtitle', label: 'Subtítulo' }, { key: 'title', label: 'Título' }, { key: 'description', label: 'Descripción' },
    { key: 'stat1Value', label: 'Estadística 1 (valor)' }, { key: 'stat1Label', label: 'Estadística 1 (etiqueta)' },
    { key: 'stat2Value', label: 'Estadística 2 (valor)' }, { key: 'stat2Label', label: 'Estadística 2 (etiqueta)' },
    { key: 'stat3Value', label: 'Estadística 3 (valor)' }, { key: 'stat3Label', label: 'Estadística 3 (etiqueta)' },
    { key: 'stat4Value', label: 'Estadística 4 (valor)' }, { key: 'stat4Label', label: 'Estadística 4 (etiqueta)' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">❤️ Nosotros</h1>
        <button onClick={handleSaveSection} disabled={saving} className="px-6 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium hover:bg-[#6B0F1E] transition disabled:opacity-50">
          {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar Sección'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Configuración de la sección</h3>
        {sectionFields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input type="text" value={section[f.key] || ''} onChange={e => setSection({ ...section, [f.key]: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A2B] outline-none" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Tarjetas de historia</h3>
        <button onClick={() => setShowCardForm(!showCardForm)} className="px-4 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium text-sm hover:bg-[#6B0F1E]">
          {showCardForm ? 'Cancelar' : '+ Agregar Tarjeta'}
        </button>
      </div>

      {showCardForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Año</label><input type="text" value={cardForm.year} onChange={e => setCardForm({...cardForm, year: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" placeholder="1985" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Título</label><input type="text" value={cardForm.title} onChange={e => setCardForm({...cardForm, title: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" placeholder="Los Inicios" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><textarea value={cardForm.description} onChange={e => setCardForm({...cardForm, description: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none" rows={2} /></div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <div className="flex gap-2">
                <input type="text" value={cardForm.imageUrl} onChange={e => setCardForm({...cardForm, imageUrl: e.target.value})} className="flex-1 px-4 py-2.5 border rounded-lg outline-none" placeholder="/images/uploads/... o pega una URL" />
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await handleUpload(f); if (url) setCardForm(prev => ({ ...prev, imageUrl: url })); } e.target.value = '' }} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 border transition disabled:opacity-50 cursor-pointer">
                  {uploading ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
              {cardForm.imageUrl && (
                <img src={cardForm.imageUrl} alt="Preview" className="mt-2 h-24 rounded-lg object-cover border border-gray-100" />
              )}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Icono</label><select value={cardForm.icon} onChange={e => setCardForm({...cardForm, icon: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg outline-none"><option value="radio">Radio</option><option value="mic">Micrófono</option><option value="headphones">Auriculares</option><option value="heart">Corazón</option></select></div>
          </div>
          <button onClick={handleCreateCard} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Crear Tarjeta</button>
        </div>
      )}

      <div className="space-y-3">
         {cards.map((card, index) => (
           <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
             {editing === card.id ? (
               <>
                 <div className="grid grid-cols-2 gap-2 flex-1">
                   <input type="text" value={card.year} onChange={e => {
                     const updatedCards = [...cards];
                     updatedCards[index] = { ...updatedCards[index], year: e.target.value };
                     setCards(updatedCards);
                   }} className="px-3 py-1.5 border rounded-lg text-sm" placeholder="Año" />
                   <input type="text" value={card.title} onChange={e => {
                     const updatedCards = [...cards];
                     updatedCards[index] = { ...updatedCards[index], title: e.target.value };
                     setCards(updatedCards);
                   }} className="px-3 py-1.5 border rounded-lg text-sm" placeholder="Título" />
                   <textarea value={card.description} onChange={e => {
                     const updatedCards = [...cards];
                     updatedCards[index] = { ...updatedCards[index], description: e.target.value };
                     setCards(updatedCards);
                   }} className="col-span-2 px-3 py-1.5 border rounded-lg text-sm" rows={2} placeholder="Descripción" />
                   <div className="col-span-2 flex gap-2">
                     <input type="text" value={card.imageUrl} onChange={e => {
                       const updatedCards = [...cards];
                       updatedCards[index] = { ...updatedCards[index], imageUrl: e.target.value };
                       setCards(updatedCards);
                     }} className="flex-1 px-3 py-1.5 border rounded-lg text-sm" placeholder="URL imagen" />
                     <input type="file" ref={editFileInputRef} accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await handleUpload(f); if (url) {
                       const updatedCards = [...cards];
                       updatedCards[index] = { ...updatedCards[index], imageUrl: url };
                       setCards(updatedCards);
                     } } e.target.value = '' }} />
                     <button type="button" onClick={() => editFileInputRef.current?.click()} disabled={uploading} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 border transition disabled:opacity-50 cursor-pointer">
                       Subir
                     </button>
                   </div>
                   <select value={card.icon} onChange={e => {
                     const updatedCards = [...cards];
                     updatedCards[index] = { ...updatedCards[index], icon: e.target.value };
                     setCards(updatedCards);
                   }} className="px-3 py-1.5 border rounded-lg text-sm">
                     <option value="radio">Radio</option><option value="mic">Micrófono</option><option value="headphones">Auriculares</option><option value="heart">Corazón</option>
                   </select>
                 </div>
                 <button onClick={() => handleUpdateCard(card.id, { year: card.year, title: card.title, description: card.description, imageUrl: card.imageUrl, icon: card.icon })} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">✓</button>
               </>
             ) : (
               <>
                 {card.imageUrl && (
                   <img src={card.imageUrl} alt={card.title} className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                 )}
                 <div className="flex-1">
                   <p className="font-semibold text-gray-900">{card.title}</p>
                   <p className="text-sm text-gray-500 truncate">{card.description}</p>
                 </div>
                 <button onClick={() => setEditing(card.id)} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">Editar</button>
                 <button onClick={() => handleDeleteCard(card.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200">Eliminar</button>
               </>
             )}
           </div>
         ))}
      </div>
    </div>
  )
}
