/**
 * WordPress API Integration - Radio Miraflores Televisión
 * 
 * Conexión con WordPress como Headless CMS
 * 
 * ARQUITECTURA:
 * - En desarrollo: El navegador llama directamente a WordPress local (XAMPP)
 * - En producción: El servidor llama a WordPress en el hosting
 * - Fallback: Datos estáticos cuando WordPress no está disponible
 */

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json'
const WP_SITE = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://purist-mongoose-ungraded.ngrok-free.dev/word'

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
}

export interface WPProgramacion {
  id: number
  title: { rendered: string }
  content: { rendered: string }
}

export interface WPCategory {
  id: number
  name: string
  slug: string
  count: number
}

// ============================================================
// CLIENT-SIDE FETCH (desde el navegador al WordPress local)
// ============================================================

/**
 * Fetch directo desde el navegador a WordPress local
 * Esto funciona porque el navegador y XAMPP están en la misma máquina
 */
async function clientFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${WP_API}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    })
    
    if (!res.ok) return null
    return await res.json()
  } catch {
    // WordPress no disponible - usar fallback
    return null
  }
}

// ============================================================
// NOTICIAS (Posts)
// ============================================================

export async function getPosts(page: number = 1, perPage: number = 6): Promise<WPPost[]> {
  const result = await clientFetch<WPPost[]>('/wp/v2/posts', {
    page: String(page),
    per_page: String(perPage),
    _embed: 'true',
    orderby: 'date',
    order: 'desc',
  })
  return result || []
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const result = await clientFetch<WPPost[]>('/wp/v2/posts', {
    slug,
    _embed: 'true',
  })
  return result?.[0] || null
}

export async function getCategories(): Promise<WPCategory[]> {
  const result = await clientFetch<WPCategory[]>('/wp/v2/categories')
  return result || []
}

// ============================================================
// RANKING INTERNACIONAL
// ============================================================

export async function getRanking(perPage: number = 10): Promise<any[]> {
  const result = await clientFetch<any[]>('/wp/v2/ranking', {
    per_page: String(perPage),
    _embed: 'true',
  })
  return result || []
}

// ============================================================
// PROGRAMACIÓN
// ============================================================

export async function getProgramacion(): Promise<any[]> {
  const result = await clientFetch<any[]>('/wp/v2/programacion', {
    per_page: '50',
    _embed: 'true',
  })
  return result || []
}

// ============================================================
// HELPERS
// ============================================================

export function getFeaturedImageUrl(post: WPPost): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (media?.source_url) {
    return replaceWpUrl(media.source_url)
  }
  return '/images/hero-radio-studio.png'
}

export function getWpImageUrl(path: string): string {
  if (path.startsWith('http')) return replaceWpUrl(path)
  return `${WP_SITE}${path}`
}

/**
 * Reemplazar URLs locales de WordPress por la URL de ngrok
 * Esto es necesario porque WordPress devuelve URLs locales (http://localhost/word/...)
 * pero necesitamos acceder a través de ngrok (https://purist-mongoose...ngrok-free.dev/word/...)
 */
const LOCAL_WP_URL = 'http://localhost/word'

function replaceWpUrl(url: string): string {
  if (url.includes('localhost/word') || url.includes('localhost%2Fword')) {
    return url.replace(/http:\/\/localhost\/word/g, WP_SITE)
  }
  return url
}

/**
 * Verificar conexión con WordPress (client-side)
 */
export async function checkWordPressConnection(): Promise<{
  connected: boolean
  siteName?: string
  siteDescription?: string
  url?: string
}> {
  try {
    const res = await fetch(WP_API, { 
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    })
    if (!res.ok) return { connected: false }
    const data = await res.json()
    return {
      connected: true,
      siteName: data.name,
      siteDescription: data.description,
      url: data.url,
    }
  } catch {
    return { connected: false }
  }
}

export default WP_API
