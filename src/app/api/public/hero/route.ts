import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const hero = await db.heroSection.findFirst()
  return NextResponse.json(hero)
}
