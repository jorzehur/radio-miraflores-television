import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const data = await request.json()
    const testimonios = readContentFile<any>('testimonios.json') || { id: 'default', items: [] }
    
    const updated = {
      ...testimonios,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    writeContentFile('testimonios.json', updated)
    await commitContentFile('testimonios.json', 'Update testimonios section')

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update testimonios section error:', error)
    return NextResponse.json({ error: 'Error al actualizar sección de testimonios' }, { status: 500 })
  }
}
