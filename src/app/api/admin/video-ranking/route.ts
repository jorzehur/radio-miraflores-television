import { db } from '@/lib/db'
import { getAdminUser } from '@/lib/admin-auth'
import { buildYouTubeThumbnail, extractYouTubeVideoId } from '@/lib/youtube'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const section = await db.videoRankingSection.findFirst()
  const items = await db.videoRankingItem.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ ...section, items })
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const existing = await db.videoRankingSection.findFirst()

  let section
  if (existing) {
    section = await db.videoRankingSection.update({ where: { id: existing.id }, data })
  } else {
    section = await db.videoRankingSection.create({ data })
  }

  return NextResponse.json(section)
}

export async function POST(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const videoId = extractYouTubeVideoId(data.youtubeUrl)

  if (!videoId) {
    return NextResponse.json({ error: 'URL de YouTube invalida' }, { status: 400 })
  }

  const item = await db.videoRankingItem.create({
    data: {
      title: data.title,
      artist: data.artist || '',
      youtubeUrl: data.youtubeUrl,
      videoId,
      thumbnailUrl: buildYouTubeThumbnail(videoId),
      sortOrder: Number(data.sortOrder) || 0,
      active: data.active ?? true,
    },
  })

  return NextResponse.json(item)
}
