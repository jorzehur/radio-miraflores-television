import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const ranking = readContentFile('ranking.json')
  return NextResponse.json(ranking)
}
