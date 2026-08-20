import { readContentFile } from '@/lib/content-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const videoRanking = readContentFile('video-ranking.json')
  return NextResponse.json(videoRanking)
}
