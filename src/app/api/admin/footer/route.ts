import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const footer = readContentFile('footer.json')
  return NextResponse.json(footer)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const footerData = {
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeContentFile('footer.json', footerData)
  await commitContentFile('footer.json', 'Update footer content')

  return NextResponse.json(footerData)
}
