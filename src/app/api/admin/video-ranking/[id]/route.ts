import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { buildYouTubeThumbnail, extractYouTubeVideoId } from '@/lib/youtube'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const data = await request.json()
  const updateData: Record<string, unknown> = { ...data }

  if (typeof data.youtubeUrl === 'string') {
    const videoId = extractYouTubeVideoId(data.youtubeUrl)
    if (!videoId) {
      return NextResponse.json({ error: 'URL de YouTube invalida' }, { status: 400 })
    }
    updateData.videoId = videoId
    updateData.thumbnailUrl = buildYouTubeThumbnail(videoId)
  }

  const item = await db.videoRankingItem.update({ where: { id }, data: updateData })
  return NextResponse.json(item)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  await db.videoRankingItem.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
