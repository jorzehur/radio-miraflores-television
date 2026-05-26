import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { downloadAndTranscode } from '@/lib/video-download'

export async function POST(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Falta el id del video' }, { status: 400 })

  const item = await db.videoRankingItem.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 })

  const result = await downloadAndTranscode(id, item.youtubeUrl)

  if (result.success) {
    return NextResponse.json({ success: true, hlsUrl: result.hlsUrl })
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }
}
