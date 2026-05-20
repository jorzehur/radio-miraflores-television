/**
 * WordPress REST API Integration - Radio Miraflores Televisión
 * 
 * Conecta Next.js con WordPress como Headless CMS.
 * Gestiona: Noticias, Ranking Internacional, Programación
 * 
 * URLs:
 * - Noticias: GET /wp-json/wp/v2/posts
 * - Ranking: GET /wp-json/wp/v2/ranking
 * - Programación: GET /wp-json/wp/v2/programacion
 * - Media: GET /wp-json/wp/v2/media
 * - Categorías: GET /wp-json/wp/v2/categories
 */

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/word/wp-json'
const WP_SITE_URL = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'http://localhost/word'

// ==========================================
// INTERFACES
// ==========================================

export interface WPPost {
  id: number
  date: string
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  featured_media: number
  categories: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
    author?: Array<{
      id: number
      name: string
      avatar_urls: Record<string, string>
    }>
  }
}

export interface WPRankingEntry {
  id: number
  title: { rendered: string }
  acf: {
    posicion: number
    cancion: string
    artista: string
    album: string
    semanas_en_ranking: number
    tendencia: 'sube' | 'baja' | 'igual'
    imagen?: string
  }
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

export interface WPProgramacion {
  id: number
  title: { rendered: string }
  acf: {
    dia: string
    hora_inicio: string
    hora_fin: string
    locutor: string
    descripcion: string
    imagen?: string
  }
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
  media_details: {
    sizes: Record<string, {
      source_url: string
      width: number
      height: number
    }>
  }
}

// ==========================================
// HELPER: Build URL with featured media embed
// ==========================================

function buildUrl(endpoint: string, params: Record<string, string> = {}): string {
  const url = new URL(`${WP_API_URL}${endpoint}`)
  url.searchParams.set('_embed', '1')
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

// ==========================================
// NOTICIAS (Posts)
// ==========================================

/**
 * Obtener noticias/posts desde WordPress
 */
export async function getPosts(page: number = 1, perPage: number = 10): Promise<WPPost[]> {
  try {
    const res = await fetch(
      buildUrl('/wp/v2/posts', {
        page: String(page),
        per_page: String(perPage),
      }),
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('WordPress API error (posts):', error)
    return []
  }
}

/**
 * Obtener un post por slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      buildUrl('/wp/v2/posts', { slug }),
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch post')
    const posts: WPPost[] = await res.json()
    return posts[0] || null
  } catch (error) {
    console.error('WordPress API error (post by slug):', error)
    return null
  }
}

/**
 * Obtener posts por categoría
 */
export async function getPostsByCategory(categoryId: number, perPage: number = 10): Promise<WPPost[]> {
  try {
    const res = await fetch(
      buildUrl('/wp/v2/posts', {
        categories: String(categoryId),
        per_page: String(perPage),
      }),
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch posts by category')
    return await res.json()
  } catch (error) {
    console.error('WordPress API error (posts by category):', error)
    return []
  }
}

// ==========================================
// RANKING INTERNACIONAL
// ==========================================

/**
 * Obtener ranking internacional de rock
 */
export async function getRanking(perPage: number = 10): Promise<WPRankingEntry[]> {
  try {
    const res = await fetch(
      buildUrl('/wp/v2/ranking', {
        per_page: String(perPage),
        orderby: 'meta_value_num',
        meta_key: 'posicion',
        order: 'asc',
      }),
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error(`Failed to fetch ranking: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('WordPress API error (ranking):', error)
    return []
  }
}

// ==========================================
// PROGRAMACIÓN
// ==========================================

/**
 * Obtener programación semanal
 */
export async function getProgramacion(): Promise<WPProgramacion[]> {
  try {
    const res = await fetch(
      buildUrl('/wp/v2/programacion', {
        per_page: '50',
        orderby: 'meta_value',
        meta_key: 'hora_inicio',
        order: 'asc',
      }),
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error(`Failed to fetch programacion: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('WordPress API error (programacion):', error)
    return []
  }
}

// ==========================================
// CATEGORÍAS
// ==========================================

/**
 * Obtener categorías
 */
export async function getCategories(): Promise<WPCategory[]> {
  try {
    const res = await fetch(
      buildUrl('/wp/v2/categories', { per_page: '50' }),
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('Failed to fetch categories')
    return await res.json()
  } catch (error) {
    console.error('WordPress API error (categories):', error)
    return []
  }
}

// ==========================================
// UTILIDADES
// ==========================================

/**
 * Obtener URL completa de imagen desde WordPress
 */
export function getImageUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${WP_SITE_URL}${path}`
}

/**
 * Obtener URL de imagen destacada desde un post
 */
export function getFeaturedImage(post: WPPost | WPRankingEntry | WPProgramacion): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (media?.source_url) {
    return media.source_url
  }
  return null
}

/**
 * Verificar conexión con WordPress
 */
export async function checkConnection(): Promise<{ connected: boolean; siteName?: string; error?: string }> {
  try {
    const res = await fetch(`${WP_API_URL}/`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return {
      connected: true,
      siteName: data.name || 'WordPress',
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export { WP_API_URL, WP_SITE_URL }
export default WP_API_URL
