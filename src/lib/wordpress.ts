/**
 * WordPress API Integration - Radio Miraflores Televisión
 * 
 * This module provides the structure for connecting to WordPress as a headless CMS.
 * Replace WORDPRESS_API_URL with your actual WordPress REST API endpoint.
 * 
 * Usage:
 * - News/Posts: GET /wp-json/wp/v2/posts
 * - Ranking: Custom post type or ACF fields
 * - Media: GET /wp-json/wp/v2/media
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json'

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

/**
 * Fetch posts from WordPress
 */
export async function getPosts(page: number = 1, perPage: number = 10): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/posts?page=${page}&per_page=${perPage}&_embed`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch posts')
    return await res.json()
  } catch (error) {
    console.error('WordPress API error (posts):', error)
    return []
  }
}

/**
 * Fetch ranking data from WordPress (custom endpoint)
 */
export async function getRanking(): Promise<WPRankingEntry[]> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/ranking?per_page=10&_embed`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('Failed to fetch ranking')
    return await res.json()
  } catch (error) {
    console.error('WordPress API error (ranking):', error)
    return []
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/posts?slug=${slug}&_embed`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch post')
    const posts = await res.json()
    return posts[0] || null
  } catch (error) {
    console.error('WordPress API error (post):', error)
    return null
  }
}

export default WORDPRESS_API_URL
