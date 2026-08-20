import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const section = await db.nosotrosSection.findFirst()
  const cards = await db.nosotrosCard.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' }
  })
  return NextResponse.json({ ...section, cards })
}
