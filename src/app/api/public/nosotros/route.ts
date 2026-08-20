import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const nosotros = readContentFile('nosotros.json')
  return NextResponse.json(nosotros)
}
