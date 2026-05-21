import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const info = await db.infoSection.findFirst()
  return NextResponse.json(info)
}
