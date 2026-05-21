import { NextResponse } from 'next/server'

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json'
const WP_SITE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const perPage = searchParams.get('per_page') || '6'
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

    // Transform posts data - include ALL posts (even those with Facebook embeds)
    const items = data
      .map((post: any) => {
        const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]
        let imageUrl = '/images/hero-radio-studio.png'
        if (featuredMedia?.source_url) {
          imageUrl = replaceLocalUrl(featuredMedia.source_url)
        }

        const contentHtml = post.content?.rendered || ''
        const excerptHtml = post.excerpt?.rendered || ''

        // Detect if content has Facebook embed
        const hasFacebookEmbed = contentHtml.includes('facebook.com/plugins/post')

        // Get clean text excerpt
        let textExcerpt = excerptHtml.replace(/<[^>]*>/g, '').trim()
        if (!textExcerpt) {
          textExcerpt = contentHtml.replace(/<iframe[^>]*><\/iframe>/g, '').replace(/<[^>]*>/g, '').substring(0, 200).trim()
        }

        // Decode HTML entities in title
        const title = (post.title?.rendered || '')
          .replace(/&#8217;/g, "'")
          .replace(/&#8220;/g, '"')
          .replace(/&#8221;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&#038;/g, '&')
          .replace(/&#8211;/g, '–')
          .replace(/&#8212;/g, '—')

        // For Facebook embeds, extract the clean iframe URL
        let facebookEmbedUrl = null
        if (hasFacebookEmbed) {
          const iframeMatch = contentHtml.match(/src="([^"]*facebook\.com\/plugins\/post\.php[^"]*)"/)
          if (iframeMatch) {
            facebookEmbedUrl = iframeMatch[1]
              .replace(/&amp;/g, '&')
              .replace(/&#038;/g, '&')
          }
        }

        return {
          id: post.id,
          title: title || 'Publicación de Facebook',
          slug: post.slug,
          date: post.date,
          excerpt: textExcerpt,
          contentHtml,
          hasFacebookEmbed,
          facebookEmbedUrl,
          image: imageUrl,
          author: post._embedded?.author?.[0]?.name || 'Radio Miraflores TV',
        }
      })
      // Filter out the default "Hello World" post
      .filter((post: any) => post.slug !== 'hola-mundo')

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
