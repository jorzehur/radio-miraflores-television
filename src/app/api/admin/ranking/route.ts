import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile, generateId } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const items = readContentFile<unknown[]>('ranking.json') || []
  const sorted = [...items].sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
  return NextResponse.json(sorted)
}

export async function POST(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const items = readContentFile<unknown[]>('ranking.json') || []
  
  const newItem = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  items.push(newItem)
  writeContentFile('ranking.json', items)
  await commitContentFile('ranking.json', 'Add ranking item', items)

  return NextResponse.json(newItem)
}
