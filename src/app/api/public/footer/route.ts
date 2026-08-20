import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const footer = readContentFile('footer.json')
  return NextResponse.json(footer)
}
