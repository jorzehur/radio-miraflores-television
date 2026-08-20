import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const nosotros = readContentFile('nosotros.json')
  return NextResponse.json(nosotros)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const nosotrosData = {
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeContentFile('nosotros.json', nosotrosData)
  await commitContentFile('nosotros.json', 'Update nosotros content', nosotrosData)

  return NextResponse.json(nosotrosData)
}
