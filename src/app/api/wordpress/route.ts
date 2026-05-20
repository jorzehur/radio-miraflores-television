import { NextResponse } from 'next/server'
import { getPosts, getRanking, getProgramacion, checkWordPressConnection } from '@/lib/wordpress'

export async function GET() {
  try {
    // Check connection first
    const connection = await checkWordPressConnection()
    
    if (!connection.connected) {
      return NextResponse.json({
        status: 'disconnected',
        error: connection.error,
        message: 'No se pudo conectar a WordPress. Verifica que XAMPP esté corriendo.',
        config: {
          apiUrl: process.env.WORDPRESS_API_URL,
          siteUrl: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
        }
      }, { status: 503 })
    }

    // Fetch all data in parallel
    const [posts, ranking, programacion] = await Promise.all([
      getPosts(1, 4),
      getRanking(10),
      getProgramacion(),
    ])

    return NextResponse.json({
      status: 'connected',
      site: {
        name: connection.siteName,
        description: connection.siteDescription,
        url: connection.url,
      },
      data: {
        posts: {
          count: posts.length,
          items: posts.map(p => ({
            id: p.id,
            title: p.title.rendered,
            slug: p.slug,
            date: p.date,
            excerpt: p.excerpt.rendered,
            image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
          })),
        },
        ranking: {
          count: ranking.length,
          items: ranking.map(r => ({
            id: r.id,
            position: r.acf?.position || 0,
            song: r.acf?.song || '',
            artist: r.acf?.artist || '',
            album: r.acf?.album || '',
            weeks: r.acf?.weeks || 0,
            trend: r.acf?.trend || 'same',
          })),
        },
        programacion: {
          count: programacion.length,
          items: programacion,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
