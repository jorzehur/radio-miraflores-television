import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const cards = await db.nosotrosCard.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(cards)
}

export async function POST(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const card = await db.nosotrosCard.create({ data })
  return NextResponse.json(card)
}
