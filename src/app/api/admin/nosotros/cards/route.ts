import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile, generateId } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const nosotros = readContentFile<any>('nosotros.json')
  const cards = nosotros?.cards || []
  const sorted = [...cards].sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
  return NextResponse.json(sorted)
}

export async function POST(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const nosotros = readContentFile<any>('nosotros.json') || { id: 'default', cards: [] }
  
  const newCard = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  nosotros.cards.push(newCard)
  nosotros.updatedAt = new Date().toISOString()
  writeContentFile('nosotros.json', nosotros)
  await commitContentFile('nosotros.json', 'Add nosotros card')

  return NextResponse.json(newCard)
}
