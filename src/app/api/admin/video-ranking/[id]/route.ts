import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
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

  const videoRanking = readContentFile<any>('video-ranking.json')
  
  if (!videoRanking) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  const index = videoRanking.items.findIndex((item: any) => item.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 })
  }

  videoRanking.items[index] = {
    ...videoRanking.items[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  }
  videoRanking.updatedAt = new Date().toISOString()

  writeContentFile('video-ranking.json', videoRanking)
  await commitContentFile('video-ranking.json', 'Update video ranking item', videoRanking)

  return NextResponse.json(videoRanking.items[index])
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const videoRanking = readContentFile<any>('video-ranking.json')
  
  if (!videoRanking) {
    return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
  }

  videoRanking.items = videoRanking.items.filter((item: any) => item.id !== id)
  videoRanking.updatedAt = new Date().toISOString()

  writeContentFile('video-ranking.json', videoRanking)
  await commitContentFile('video-ranking.json', 'Delete video ranking item', videoRanking)

  return NextResponse.json({ success: true })
}
