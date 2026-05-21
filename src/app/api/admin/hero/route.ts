import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const hero = await db.heroSection.findFirst()
  return NextResponse.json(hero)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const existing = await db.heroSection.findFirst()

  let hero
  if (existing) {
    hero = await db.heroSection.update({ where: { id: existing.id }, data })
  } else {
    hero = await db.heroSection.create({ data })
  }
  return NextResponse.json(hero)
}
