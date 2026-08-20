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

  writeContentFile('hero.json', heroData)
  const committed = await commitContentFile('hero.json', 'Update hero content', heroData)
  if (!committed) {
    console.warn('Commit a GitHub falló o GITHUB_TOKEN no está configurado')
  }

  return NextResponse.json(heroData)
}

