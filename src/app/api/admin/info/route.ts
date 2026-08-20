import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const info = await db.infoSection.findFirst()
  return NextResponse.json(info)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const existing = await db.infoSection.findFirst()

  let info
  if (existing) {
    info = await db.infoSection.update({ where: { id: existing.id }, data })
  } else {
    info = await db.infoSection.create({ data })
  }
  return NextResponse.json(info)
}
