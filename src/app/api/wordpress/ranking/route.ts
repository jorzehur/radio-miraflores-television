import { NextResponse } from 'next/server'
import { getRanking } from '@/lib/wordpress'

export async function GET() {
  try {
    const ranking = await getRanking(10)
    
    if (!ranking || ranking.length === 0) {
      return NextResponse.json({
        status: 'no_data',
        message: 'No hay datos de ranking. Agrega posiciones desde WordPress.',
        data: [],
      })
    }

    return NextResponse.json({
      status: 'ok',
      data: ranking.map(r => ({
        id: r.id,
        position: r.acf?.position || 0,
        song: r.acf?.song || r.title?.rendered || '',
        artist: r.acf?.artist || '',
        album: r.acf?.album || '',
        weeks: r.acf?.weeks || 0,
        trend: r.acf?.trend || 'same',
        image: r.acf?.cover_image || null,
      })),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
