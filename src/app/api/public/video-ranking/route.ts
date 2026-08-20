import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const section = await db.videoRankingSection.findFirst()
  const items = await db.videoRankingItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({ ...section, items })
}
