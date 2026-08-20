import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/admin-auth'

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const data = await request.json()
    const currentSection = await db.redesSection.findFirst()

    if (!currentSection) {
      const section = await db.redesSection.create({ data })
      return NextResponse.json(section)
    }

    const section = await db.redesSection.update({
      where: { id: currentSection.id },
      data,
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Update redes section error:', error)
    return NextResponse.json({ error: 'Error al actualizar sección de redes' }, { status: 500 })
  }
})
