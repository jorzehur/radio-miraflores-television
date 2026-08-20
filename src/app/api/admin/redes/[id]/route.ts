import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const data = await request.json()
  const redes = readContentFile<any>('redes.json')
  
  if (!redes) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  const index = redes.items.findIndex((item: any) => item.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
  }

  redes.items[index] = {
    ...redes.items[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  redes.updatedAt = new Date().toISOString()

  writeContentFile('redes.json', redes)
  await commitContentFile('redes.json', 'Update red social item')

  return NextResponse.json(redes.items[index])
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const redes = readContentFile<any>('redes.json')
  
  if (!redes) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  redes.items = redes.items.filter((item: any) => item.id !== id)
  redes.updatedAt = new Date().toISOString()

  writeContentFile('redes.json', redes)
  await commitContentFile('redes.json', 'Delete red social item')

  return NextResponse.json({ success: true })
}
