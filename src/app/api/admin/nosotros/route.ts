import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const section = await db.nosotrosSection.findFirst()
  const cards = await db.nosotrosCard.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ ...section, cards })
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { cards, ...sectionData } = await request.json()
  const existing = await db.nosotrosSection.findFirst()

  let section
  if (existing) {
    section = await db.nosotrosSection.update({ where: { id: existing.id }, data: sectionData })
  } else {
    section = await db.nosotrosSection.create({ data: sectionData })
  }
  return NextResponse.json(section)
}
