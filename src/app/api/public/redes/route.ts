import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const redes = readContentFile('redes.json')
  return NextResponse.json(redes)
}
