/**
 * WordPress API Integration - Radio Miraflores Televisión
 * 
 * Conexión con WordPress como Headless CMS
 * URL: http://localhost/word/wp-json
 * 
 * Gestiona: Noticias, Ranking Internacional, Programación
 */

const WP_API = process.env.WORDPRESS_API_URL || 'http://localhost/word/wp-json'
const WP_SITE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'http://localhost/word'
const REVALIDATE = parseInt(process.env.WORDPRESS_REVALIDATE_TIME || '60')

// ============================================================
// INTERFACES
// ============================================================

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
      avatar_urls?: Record<string, string>
    }>
  }
}

export interface WPRankingEntry {
  id: number
  position: number
  song: string
  artist: string
  album: string
  weeks: number
  trend: 'up' | 'down' | 'same'
  imageUrl?: string
  artistUrl?: string
  acf?: {
    position: number
    song: string
    artist: string
    album: string
    weeks: number
    trend: string
    cover_image?: string
  }
}

export interface WPProgramacion {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  acf?: {
    dia: string
    hora_inicio: string
    hora_fin: string
    locutor: string
    imagen?: string
  }
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
}

// ============================================================
// HELPER: Fetch con revalidación
// ============================================================

async function wpFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${WP_API}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    
    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) {
      console.error(`WordPress API error: ${res.status} ${res.statusText} for ${url.toString()}`)
      return null
    }
    
    return await res.json()
  } catch (error) {
    console.error('WordPress API connection error:', error)
    return null
  }
}

// ============================================================
// NOTICIAS (Posts)
// ============================================================

/**
 * Obtener noticias/posts desde WordPress
 */
export async function getPosts(page: number = 1, perPage: number = 6): Promise<WPPost[]> {
  const result = await wpFetch<WPPost[]>('/wp/v2/posts', {
    page: String(page),
    per_page: String(perPage),
    _embed: 'true',
    orderby: 'date',
    order: 'desc',
  })
  return result || []
}

/**
 * Obtener un post por slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const result = await wpFetch<WPPost[]>('/wp/v2/posts', {
    slug,
    _embed: 'true',
  })
  return result?.[0] || null
}

/**
 * Obtener posts por categoría
 */
export async function getPostsByCategory(categoryId: number, perPage: number = 6): Promise<WPPost[]> {
  const result = await wpFetch<WPPost[]>('/wp/v2/posts', {
    categories: String(categoryId),
    per_page: String(perPage),
    _embed: 'true',
  })
  return result || []
}

/**
 * Obtener categorías
 */
export async function getCategories(): Promise<WPCategory[]> {
  const result = await wpFetch<WPCategory[]>('/wp/v2/categories')
  return result || []
}

// ============================================================
// RANKING INTERNACIONAL (Custom Post Type)
// ============================================================

/**
 * Obtener ranking internacional de rock
 * Requiere Custom Post Type "ranking" creado en WordPress
 */
export async function getRanking(perPage: number = 10): Promise<WPRankingEntry[]> {
  // Intentar con ACF (Advanced Custom Fields)
  const result = await wpFetch<WPRankingEntry[]>('/wp/v2/ranking', {
    per_page: String(perPage),
    _embed: 'true',
    orderby: 'meta_value_num',
    meta_key: 'position',
    order: 'asc',
  })
  return result || []
}

// ============================================================
// PROGRAMACIÓN (Custom Post Type)
// ============================================================

/**
 * Obtener programación de la radio
 * Requiere Custom Post Type "programacion" creado en WordPress
 */
export async function getProgramacion(): Promise<WPProgramacion[]> {
  const result = await wpFetch<WPProgramacion[]>('/wp/v2/programacion', {
    per_page: '50',
    _embed: 'true',
    orderby: 'meta_value',
    meta_key: 'hora_inicio',
    order: 'asc',
  })
  return result || []
}

// ============================================================
// MEDIA
// ============================================================

/**
 * Obtener URL de imagen destacada
 */
export function getFeaturedImageUrl(post: WPPost, size: string = 'full'): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (media?.source_url) {
    return media.source_url
  }
  return '/images/hero-radio-studio.png' // fallback
}

/**
 * Construir URL de imagen de WordPress
 */
export function getWpImageUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${WP_SITE}${path}`
}

// ============================================================
// HEALTH CHECK
// ============================================================

/**
 * Verificar conexión con WordPress
 */
export async function checkWordPressConnection(): Promise<{
  connected: boolean
  siteName?: string
  siteDescription?: string
  url?: string
  error?: string
}> {
  try {
    const res = await fetch(`${WP_API}`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      return { connected: false, error: `HTTP ${res.status}` }
    }
    const data = await res.json()
    return {
      connected: true,
      siteName: data.name,
      siteDescription: data.description,
      url: data.url,
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

export default WP_API
