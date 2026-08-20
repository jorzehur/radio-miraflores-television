import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const hero = readContentFile('hero.json')
  return NextResponse.json(hero)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const heroData = {
    ...data,
    updatedAt: new Date().toISOString(),
  }

  const saved = writeContentFile('hero.json', heroData)
  if (!saved) {
    return NextResponse.json({ error: 'Error guardando localmente' }, { status: 500 })
  }

  const committed = await commitContentFile('hero.json', `Update hero content`)
  if (!committed) {
    console.warn('Commit a GitHub falló, pero se guardó localmente')
  }

  return NextResponse.json(heroData)
}
