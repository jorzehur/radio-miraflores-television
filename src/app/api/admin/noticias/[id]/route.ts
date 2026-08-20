import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const data = await request.json()
  const noticias = readContentFile<any>('noticias.json')
  
  if (!noticias) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  const index = noticias.items.findIndex((item: any) => item.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
  }

  noticias.items[index] = {
    ...noticias.items[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  noticias.updatedAt = new Date().toISOString()

  writeContentFile('noticias.json', noticias)
  await commitContentFile('noticias.json', 'Update noticia item', noticias)

  return NextResponse.json(noticias.items[index])
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const noticias = readContentFile<any>('noticias.json')
  
  if (!noticias) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  noticias.items = noticias.items.filter((item: any) => item.id !== id)
  noticias.updatedAt = new Date().toISOString()

  writeContentFile('noticias.json', noticias)
  await commitContentFile('noticias.json', 'Delete noticia item', noticias)

  return NextResponse.json({ success: true })
}
