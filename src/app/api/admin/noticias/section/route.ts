import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const data = await request.json()
    const noticias = readContentFile<any>('noticias.json') || { id: 'default', items: [] }
    
    const updated = {
      ...noticias,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    writeContentFile('noticias.json', updated)
    await commitContentFile('noticias.json', 'Update noticias section')

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update noticias section error:', error)
    return NextResponse.json({ error: 'Error al actualizar sección de noticias' }, { status: 500 })
  }
}
