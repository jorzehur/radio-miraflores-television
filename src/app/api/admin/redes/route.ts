import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const redes = readContentFile('redes.json')
  return NextResponse.json(redes)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const redesData = {
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeContentFile('redes.json', redesData)
  await commitContentFile('redes.json', 'Update redes content')

  return NextResponse.json(redesData)
}
