import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const testimonios = readContentFile('testimonios.json')
  return NextResponse.json(testimonios)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const testimoniosData = {
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeContentFile('testimonios.json', testimoniosData)
  await commitContentFile('testimonios.json', 'Update testimonios content', testimoniosData)

  return NextResponse.json(testimoniosData)
}
