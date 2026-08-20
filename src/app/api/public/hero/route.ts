import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const hero = readContentFile('hero.json')
  return NextResponse.json(hero)
}
