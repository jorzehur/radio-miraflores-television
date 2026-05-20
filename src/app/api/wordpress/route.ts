import { NextResponse } from 'next/server'
import { checkConnection, getPosts, getRanking, getCategories } from '@/lib/wordpress'

export async function GET() {
  try {
    // Verificar conexión con WordPress
    const connection = await checkConnection()
    
    if (!connection.connected) {
      return NextResponse.json({
        status: 'disconnected',
        message: 'No se pudo conectar con WordPress',
        error: connection.error,
        hint: 'Verifica que WordPress esté corriendo y la REST API esté habilitada en /wp-json/',
      }, { status: 503 })
    }

    // Obtener datos de prueba
    const [posts, ranking, categories] = await Promise.all([
      getPosts(1, 5),
      getRanking(4),
      getCategories(),
    ])

    return NextResponse.json({
      status: 'connected',
      siteName: connection.siteName,
      data: {
        posts: posts.length,
        ranking: ranking.length,
        categories: categories.length,
      },
      sampleData: {
        latestPosts: posts.map(p => ({
          id: p.id,
          title: p.title.rendered,
          date: p.date,
          slug: p.slug,
        })),
        ranking: ranking.map(r => ({
          id: r.id,
          position: r.acf?.posicion,
          song: r.acf?.cancion,
          artist: r.acf?.artista,
        })),
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          count: c.count,
        })),
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
