import { NextResponse } from 'next/server'

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json'
const WP_SITE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const perPage = searchParams.get('per_page') || '4'
    const page = searchParams.get('page') || '1'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(
      `${WP_API}/wp/v2/posts?per_page=${perPage}&page=${page}&_embed=true&orderby=date&order=desc`,
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        signal: controller.signal,
      }
    )

    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ error: 'WordPress no disponible', status: res.status }, { status: 502 })
    }

    const data = await res.json()

    // Transform and filter posts data
    const items = data
      .filter((post: any) => {
        // Filter out posts with empty titles
        const title = post.title?.rendered?.replace(/<[^>]*>/g, '').trim() || ''
        return title.length > 0
      })
      .map((post: any) => {
        const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]
        let imageUrl = '/images/hero-radio-studio.png'
        if (featuredMedia?.source_url) {
          imageUrl = replaceLocalUrl(featuredMedia.source_url)
        }

        // Get clean excerpt - prefer excerpt, fall back to content
        let excerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() || ''
        if (!excerpt) {
          excerpt = post.content?.rendered?.replace(/<[^>]*>/g, '').substring(0, 200).trim() || ''
        }

        // Decode HTML entities in title
        const title = (post.title?.rendered || '')
          .replace(/&#8217;/g, "'")
          .replace(/&#8220;/g, '"')
          .replace(/&#8221;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&#038;/g, '&')

        return {
          id: post.id,
          title,
          slug: post.slug,
          date: post.date,
          excerpt,
          content: post.content?.rendered?.replace(/<[^>]*>/g, '').trim() || '',
          image: imageUrl,
          author: post._embedded?.author?.[0]?.name || 'Radio Miraflores TV',
        }
      })

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Error de conexión con WordPress' }, { status: 503 })
  }
}

function replaceLocalUrl(url: string): string {
  if (url && url.includes('localhost/word')) {
    return url.replace(/http:\/\/localhost\/word/g, WP_SITE)
  }
  return url
}
