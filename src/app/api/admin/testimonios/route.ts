import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const section = await db.testimoniosSection.findFirst()
  const items = await db.testimonioItem.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ ...section, items })
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const existing = await db.testimoniosSection.findFirst()

  let section
  if (existing) {
    section = await db.testimoniosSection.update({ where: { id: existing.id }, data })
  } else {
    section = await db.testimoniosSection.create({ data })
  }
  return NextResponse.json(section)
}

export async function POST(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const item = await db.testimonioItem.create({ data })
  return NextResponse.json(item)
}
