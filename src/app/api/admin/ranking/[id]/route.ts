import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const data = await request.json()
  const items = readContentFile<any[]>('ranking.json') || []
  
  const index = items.findIndex((item: any) => item.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
  }

  items[index] = {
    ...items[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeContentFile('ranking.json', items)
  await commitContentFile('ranking.json', 'Update ranking item', items)

  return NextResponse.json(items[index])
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const items = readContentFile<any[]>('ranking.json') || []
  
  const filtered = items.filter((item: any) => item.id !== id)
  writeContentFile('ranking.json', filtered)
  await commitContentFile('ranking.json', 'Delete ranking item', filtered)

  return NextResponse.json({ success: true })
}
