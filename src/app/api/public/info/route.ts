import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const info = readContentFile('info.json')
  return NextResponse.json(info)
}
