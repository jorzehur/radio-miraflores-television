import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/admin-auth'

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const data = await request.json()
    const currentSection = await db.noticiasSection.findFirst()

    if (!currentSection) {
      const section = await db.noticiasSection.create({ data })
      return NextResponse.json(section)
    }

    const section = await db.noticiasSection.update({
      where: { id: currentSection.id },
      data,
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Update noticias section error:', error)
    return NextResponse.json({ error: 'Error al actualizar sección de noticias' }, { status: 500 })
  }
})
