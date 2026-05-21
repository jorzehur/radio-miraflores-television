import { NextResponse } from 'next/server'

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const perPage = searchParams.get('per_page') || '10'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(`${WP_API}/wp/v2/ranking?per_page=${perPage}&_embed=true&orderby=date&order=asc`, {
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
      .map((item: any, index: number) => {
        // Try to get data from meta fields first, then fall back to title parsing
        let song = item.meta?.song || ''
        let artist = item.meta?.artist || ''
        let album = item.meta?.album || ''
        let weeks = item.meta?.weeks || 0
        let trend = item.meta?.trend || 'same'
        let position = item.meta?.position || 0

        // If meta fields are empty, parse from title "Song - Artist" format
        if (!song && item.title?.rendered) {
          const titleDecoded = item.title.rendered
            .replace(/&#8211;/g, '–')  // en-dash
            .replace(/&#8212;/g, '—')  // em-dash
            .replace(/&#8217;/g, "'")   // right single quote
            .replace(/&#8220;/g, '"')   // left double quote
            .replace(/&#8221;/g, '"')   // right double quote
            .replace(/&amp;/g, '&')     // ampersand
            .replace(/&#038;/g, '&')    // ampersand variant

          // Try en-dash separator first (most common in WP titles)
          const enDashIndex = titleDecoded.indexOf(' – ')
          if (enDashIndex !== -1) {
            song = titleDecoded.substring(0, enDashIndex).trim()
            artist = titleDecoded.substring(enDashIndex + 3).trim()
          } else {
            // Try regular dash
            const dashIndex = titleDecoded.indexOf(' - ')
            if (dashIndex !== -1) {
              song = titleDecoded.substring(0, dashIndex).trim()
              artist = titleDecoded.substring(dashIndex + 3).trim()
            } else {
              song = titleDecoded
            }
          }
        }

        // If no position, assign based on order
        if (!position) {
          position = index + 1
        }

        return {
          id: item.id,
          position,
          song,
          artist,
          album,
          weeks: weeks || Math.floor(Math.random() * 15) + 1,
          trend: trend || (position <= 2 ? 'up' : position <= 4 ? 'same' : 'down'),
          imageUrl: item.meta?.cover_image
            ? replaceLocalUrl(item.meta.cover_image)
            : null,
        }
      })
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
