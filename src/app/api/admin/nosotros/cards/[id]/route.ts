import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const data = await request.json()
  const nosotros = readContentFile<any>('nosotros.json')
  
  if (!nosotros) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  const index = nosotros.cards.findIndex((card: any) => card.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Card no encontrada' }, { status: 404 })
  }

  nosotros.cards[index] = {
    ...nosotros.cards[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  nosotros.updatedAt = new Date().toISOString()

  writeContentFile('nosotros.json', nosotros)
  await commitContentFile('nosotros.json', 'Update nosotros card', nosotros)

  return NextResponse.json(nosotros.cards[index])
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const nosotros = readContentFile<any>('nosotros.json')
  
  if (!nosotros) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  nosotros.cards = nosotros.cards.filter((card: any) => card.id !== id)
  nosotros.updatedAt = new Date().toISOString()

  writeContentFile('nosotros.json', nosotros)
  await commitContentFile('nosotros.json', 'Delete nosotros card', nosotros)

  return NextResponse.json({ success: true })
}
