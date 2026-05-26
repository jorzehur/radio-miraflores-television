import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/admin-auth'
import { db } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const item = await db.videoRankingItem.findUnique({ where: { id }, select: { downloadStatus: true, downloadError: true, hlsUrl: true } })
  if (!item) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json(item)
}
