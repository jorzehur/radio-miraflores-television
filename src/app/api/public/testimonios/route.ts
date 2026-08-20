import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const section = await db.testimoniosSection.findFirst()
  const items = await db.testimonioItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' }
  })
  return NextResponse.json({ ...section, items })
}
