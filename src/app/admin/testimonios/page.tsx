'use client'

import { useEffect, useState, useRef } from 'react'

interface Testimonio { id: string; name: string; role: string; quote: string; imageUrl: string | null; rating: number; active: boolean; sortOrder: number }

export default function AdminTestimonios() {
  const [section, setSection] = useState<Record<string, string>>({})
  const [items, setItems] = useState<Testimonio[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', quote: '', imageUrl: '', rating: 5, sortOrder: 0 })
  const [editing, setEditing] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/testimonios').then(r => r.json()).then(d => { setSection(d || {}); setItems(d?.items || []) })
  }, [])

  async function handleSaveSection() {
    setSaving(true); setSaved(false)
    const { items: _, ...data } = section as any
    await fetch('/api/admin/testimonios', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
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

  async function handleCreate() {
    await fetch('/api/admin/testimonios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null, active: true }) })
    setForm({ name: '', role: '', quote: '', imageUrl: '', rating: 5, sortOrder: 0 }); setShowForm(false); loadItems()
  }

  async function handleUpdate(id: string, data: Partial<Testimonio>) {
    await fetch(`/api/admin/testimonios/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setEditing(null); loadItems()
  }

  async function handleDelete(id: string) { if (!confirm('¿Eliminar?')) return; await fetch(`/api/admin/testimonios/${id}`, { method: 'DELETE' }); loadItems() }
  async function loadItems() { const res = await fetch('/api/admin/testimonios'); const d = await res.json(); setItems(d?.items || []) }

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">💬 Testimonios</h1>
        <button onClick={handleSaveSection} disabled={saving} className="px-6 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium hover:bg-[#6B0F1E] transition disabled:opacity-50">
          {saving ? 'Guardando...' : saved ? '✓ Guardado!' : 'Guardar'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4 w-full max-w-full overflow-hidden">
        {['subtitle', 'title', 'description'].map(key => (
          <div key={key} className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key === 'subtitle' ? 'Subtítulo' : key === 'title' ? 'Título' : 'Descripción'}</label>
            <input type="text" value={section[key] || ''} onChange={e => setSection({...section, [key]: e.target.value})} className="w-full min-w-0 px-4 py-2.5 border rounded-lg outline-none" />
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-700">Testimonios ({items.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#8B1A2B] text-white rounded-lg font-medium text-sm hover:bg-[#6B0F1E]">{showForm ? 'Cancelar' : '+ Agregar'}</button>
      </div>

      {showForm && (
        <div className="mb-4 w-full max-w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-6">
            <div className="min-w-0 md:col-span-3"><label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full min-w-0 rounded-lg border px-4 py-2.5 outline-none" /></div>
            <div className="min-w-0 md:col-span-3"><label className="mb-1 block text-sm font-medium text-gray-700">Rol</label><input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full min-w-0 rounded-lg border px-4 py-2.5 outline-none" placeholder="Oyente desde 2005" /></div>
            <div className="min-w-0 md:col-span-6"><label className="mb-1 block text-sm font-medium text-gray-700">Testimonio</label><textarea value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} className="w-full min-w-0 rounded-lg border px-4 py-2.5 outline-none" rows={3} /></div>
            <div className="min-w-0 md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
              <div className="flex flex-col gap-2 min-w-0 sm:flex-row">
                <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="flex-1 min-w-0 px-4 py-2.5 border rounded-lg outline-none" placeholder="/images/uploads/... o pega una URL" />
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await handleUpload(f); if (url) setForm(prev => ({ ...prev, imageUrl: url })); } e.target.value = '' }} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 border transition whitespace-nowrap disabled:opacity-50 cursor-pointer sm:self-auto self-start">
                  {uploading ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 w-24 rounded-full object-cover border border-gray-100" />
              )}
            </div>
            <div className="min-w-0 md:col-span-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] md:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Rating (1-5)</label>
                  <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: +e.target.value})} className="w-full min-w-0 rounded-lg border px-4 py-2.5 outline-none" />
                </div>
                <button onClick={handleCreate} className="self-end px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition whitespace-nowrap">Crear</button>
              </div>
            </div>
          </div>
        </div>
      )}

       <div className="space-y-3">
         {items.map((item, index) => (
           <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-full max-w-full overflow-hidden">
             {editing === item.id ? (
                 <div className="space-y-3">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                     <div className="min-w-0">
                       <input type="text" value={item.name} onChange={e => {
                         const updatedItems = [...items];
                         updatedItems[index] = { ...updatedItems[index], name: e.target.value };
                         setItems(updatedItems);
                       }} className="w-full min-w-0 px-3 py-1.5 border rounded-lg text-sm" placeholder="Nombre" />
                     </div>
                     <div className="min-w-0">
                       <input type="text" value={item.role} onChange={e => {
                         const updatedItems = [...items];
                         updatedItems[index] = { ...updatedItems[index], role: e.target.value };
                         setItems(updatedItems);
                       }} className="w-full min-w-0 px-3 py-1.5 border rounded-lg text-sm" placeholder="Rol" />
                     </div>
                     <div className="sm:col-span-2 min-w-0">
                       <textarea value={item.quote} onChange={e => {
                         const updatedItems = [...items];
                         updatedItems[index] = { ...updatedItems[index], quote: e.target.value };
                         setItems(updatedItems);
                       }} className="w-full min-w-0 px-3 py-1.5 border rounded-lg text-sm" rows={2} placeholder="Testimonio" />
                     </div>
                     <div className="sm:col-span-2 min-w-0">
                       <div className="flex flex-col gap-2 min-w-0 sm:flex-row">
                         <input type="text" value={item.imageUrl || ''} onChange={e => {
                           const updatedItems = [...items];
                           updatedItems[index] = { ...updatedItems[index], imageUrl: e.target.value };
                           setItems(updatedItems);
                         }} className="flex-1 min-w-0 px-3 py-1.5 border rounded-lg text-sm" placeholder="URL foto" />
                         <input type="file" ref={editFileInputRef} accept="image/*" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await handleUpload(f); if (url) {
                           const updatedItems = [...items];
                           updatedItems[index] = { ...updatedItems[index], imageUrl: url };
                           setItems(updatedItems);
                         } } e.target.value = '' }} />
                         <button type="button" onClick={() => editFileInputRef.current?.click()} disabled={uploading} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 border transition whitespace-nowrap disabled:opacity-50 cursor-pointer sm:self-auto self-start">
                           Subir
                         </button>
                       </div>
                     </div>
                     <div className="min-w-0">
                       <label className="block text-xs text-gray-500 mb-1">Rating</label>
                       <input type="number" min={1} max={5} value={item.rating} onChange={e => {
                         const updatedItems = [...items];
                         updatedItems[index] = { ...updatedItems[index], rating: +e.target.value };
                         setItems(updatedItems);
                       }} className="w-full min-w-0 px-3 py-1.5 border rounded-lg text-sm" />
                     </div>
                   </div>
                 <div className="flex flex-wrap justify-end gap-2">
                   <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">Cancelar</button>
                   <button onClick={() => handleUpdate(item.id, { name: item.name, role: item.role, quote: item.quote, imageUrl: item.imageUrl, rating: item.rating })} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Guardar</button>
                 </div>
               </div>
             ) : (
               <div className="flex w-full max-w-full flex-col gap-4 overflow-hidden sm:flex-row sm:items-start">
                 {item.imageUrl ? (
                   <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0 mt-0.5" />
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1A2B] to-[#A63346] flex items-center justify-center flex-shrink-0 mt-0.5">
                     <span className="text-white font-bold text-xs">{item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</span>
                   </div>
                 )}
                 <div className="flex-1 min-w-0">
                   <p className="font-semibold text-gray-900 break-words">{item.name} <span className="text-gray-400 font-normal text-sm break-words">· {item.role}</span></p>
                   <p className="text-sm text-gray-500 break-words">{item.quote}</p>
                   <p className="text-xs text-yellow-500 mt-1">{'★'.repeat(item.rating)}</p>
                 </div>
                 <div className="flex flex-wrap gap-2 flex-shrink-0 sm:justify-end">
                   <button onClick={() => setEditing(item.id)} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 whitespace-nowrap">Editar</button>
                   <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 whitespace-nowrap">Eliminar</button>
                 </div>
               </div>
             )}
           </div>
         ))}
       </div>
    </div>
  )
}
