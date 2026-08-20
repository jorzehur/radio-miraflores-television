import { getAdminUser } from '@/lib/admin-auth'
import { readContentFile, writeContentFile, commitContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const videoRanking = readContentFile('video-ranking.json')
  return NextResponse.json(videoRanking)
}

export async function PUT(request: Request) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const data = await request.json()
  const videoRankingData = {
    ...data,
    updatedAt: new Date().toISOString(),
  }

  writeContentFile('video-ranking.json', videoRankingData)
  await commitContentFile('video-ranking.json', 'Update video ranking content')

  return NextResponse.json(videoRankingData)
}
