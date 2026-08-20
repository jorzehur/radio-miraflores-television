import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const data = await request.json()
    const redes = readContentFile<any>('redes.json') || { id: 'default', items: [] }
    
    const updated = {
      ...redes,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    writeContentFile('redes.json', updated)
    await commitContentFile('redes.json', 'Update redes section')

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update redes section error:', error)
    return NextResponse.json({ error: 'Error al actualizar sección de redes' }, { status: 500 })
  }
}
