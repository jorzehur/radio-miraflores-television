import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const footer = await db.footerSection.findFirst()
  return NextResponse.json(footer)
}
