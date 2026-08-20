import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const footer = await db.footerSection.findFirst()
  return NextResponse.json(footer)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const existing = await db.footerSection.findFirst()

  let footer
  if (existing) {
    footer = await db.footerSection.update({ where: { id: existing.id }, data })
  } else {
    footer = await db.footerSection.create({ data })
  }
  return NextResponse.json(footer)
}
