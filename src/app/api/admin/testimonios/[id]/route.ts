import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const data = await request.json()
  const testimonios = readContentFile<any>('testimonios.json')
  
  if (!testimonios) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  const index = testimonios.items.findIndex((item: any) => item.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
  }

  testimonios.items[index] = {
    ...testimonios.items[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  testimonios.updatedAt = new Date().toISOString()

  writeContentFile('testimonios.json', testimonios)
  await commitContentFile('testimonios.json', 'Update testimonio item')

  return NextResponse.json(testimonios.items[index])
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const testimonios = readContentFile<any>('testimonios.json')
  
  if (!testimonios) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  testimonios.items = testimonios.items.filter((item: any) => item.id !== id)
  testimonios.updatedAt = new Date().toISOString()

  writeContentFile('testimonios.json', testimonios)
  await commitContentFile('testimonios.json', 'Delete testimonio item')

  return NextResponse.json({ success: true })
}
