import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const items = await db.rankingItem.findMany({
    where: { active: true },
    orderBy: { position: 'asc' }
  })
  return NextResponse.json(items)
}
