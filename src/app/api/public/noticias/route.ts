import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const section = await db.noticiasSection.findFirst()
  const items = await db.noticiaItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' }
  })
  return NextResponse.json({ ...section, items })
}
