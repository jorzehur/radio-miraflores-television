import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile, generateId } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const noticias = readContentFile<any>('noticias.json')
  if (!noticias) {
    return NextResponse.json({ id: 'default', subtitle: 'Últimas Noticias', title: 'Noticias', description: '', maxVisible: 4, updatedAt: '', items: [] })
  }
  return NextResponse.json(noticias)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const noticias = readContentFile<any>('noticias.json') || { id: 'default', items: [] }
  
  const updated = {
    ...noticias,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeContentFile('noticias.json', updated)
  await commitContentFile('noticias.json', 'Update noticias section')

  return NextResponse.json(updated)
}

export async function POST(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const noticias = readContentFile<any>('noticias.json') || { id: 'default', subtitle: 'Últimas Noticias', title: 'Noticias', description: '', maxVisible: 4, items: [] }
  
  const newItem = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  noticias.items.push(newItem)
  noticias.updatedAt = new Date().toISOString()
  writeContentFile('noticias.json', noticias)
  await commitContentFile('noticias.json', 'Add noticia item')

  return NextResponse.json(newItem)
}
