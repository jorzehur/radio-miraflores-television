import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/wordpress'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '6')
    
    const posts = await getPosts(page, perPage)
    
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        status: 'no_data',
        message: 'No hay noticias. Agrega posts desde WordPress.',
        data: [],
      })
    }

    return NextResponse.json({
      status: 'ok',
      data: posts.map(p => ({
        id: p.id,
        title: p.title.rendered,
        slug: p.slug,
        date: p.date,
        excerpt: p.excerpt.rendered,
        content: p.content.rendered,
        image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        author: p._embedded?.author?.[0]?.name || 'Radio Miraflores TV',
        categories: p._embedded?.['wp:term']?.[0] || [],
      })),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
