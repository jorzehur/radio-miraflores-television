import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const testimonios = readContentFile('testimonios.json')
  return NextResponse.json(testimonios)
}
