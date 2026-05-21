import { NextResponse } from 'next/server'

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const perPage = searchParams.get('per_page') || '10'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(`${WP_API}/wp/v2/ranking?per_page=${perPage}&_embed=true`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ error: 'WordPress no disponible', status: res.status }, { status: 502 })
    }

    const data = await res.json()

    // Transform ranking data
    const items = data
      .map((item: any) => ({
        id: item.id,
        position: item.meta?.position || 0,
        song: item.meta?.song || item.title?.rendered || '',
        artist: item.meta?.artist || '',
        album: item.meta?.album || '',
        weeks: item.meta?.weeks || 0,
        trend: item.meta?.trend || 'same',
        imageUrl: item.meta?.cover_image
          ? replaceLocalUrl(item.meta.cover_image)
          : null,
      }))
      .sort((a: any, b: any) => a.position - b.position)

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Error de conexión con WordPress' }, { status: 503 })
  }
}

function replaceLocalUrl(url: string): string {
  const WP_SITE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word'
  if (url && url.includes('localhost/word')) {
    return url.replace(/http:\/\/localhost\/word/g, WP_SITE)
  }
  return url
}
