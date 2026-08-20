import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const noticias = readContentFile('noticias.json')
  return NextResponse.json(noticias)
}
