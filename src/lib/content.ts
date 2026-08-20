import { readFileSync } from 'fs'
import { join } from 'path'

const contentDir = join(process.cwd(), 'src', 'content')

export function readContent<T>(name: string): T {
  const raw = readFileSync(join(contentDir, name), 'utf-8')
  return JSON.parse(raw) as T
}

export interface HeroData {
  id: string
  title: string
  titleHighlight: string
  subtitle: string
  ctaPrimaryText: string
  ctaPrimaryLink: string
  ctaSecondaryText: string
  ctaSecondaryLink: string
  backgroundImage: string
  overlayColor: string
  updatedAt: string
}

export interface VideoRankingItem {
  id: string
  title: string
  artist: string
  youtubeUrl: string
  videoId: string
  thumbnailUrl: string | null
  active: boolean
  sortOrder: number
}

export interface VideoRankingData {
  id: string
  subtitle: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
  items: VideoRankingItem[]
}

export interface RankingItem {
  id: string
  position: number
  song: string
  artist: string
  album: string
  weeks: number
  trend: string
  imageUrl?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface NosotrosCard {
  id: string
  year: string
  title: string
  description: string
  imageUrl: string
  icon: string
  sortOrder: number
  active: boolean
  updatedAt: string
}

export interface NosotrosData {
  id: string
  subtitle: string
  title: string
  description: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Value: string
  stat3Label: string
  stat4Value: string
  stat4Label: string
  updatedAt: string
  cards: NosotrosCard[]
}

export interface NoticiaItem {
  id: string
  title: string
  excerpt: string | null
  content: string | null
  imageUrl: string | null
  author: string
  facebookEmbedUrl: string | null
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface NoticiasData {
  id: string
  subtitle: string
  title: string
  description: string
  maxVisible: number
  updatedAt: string
  items: NoticiaItem[]
}

export interface TestimonioItem {
  id: string
  name: string
  role: string
  quote: string
  imageUrl: string | null
  rating: number
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TestimoniosData {
  id: string
  subtitle: string
  title: string
  description: string
  updatedAt: string
  items: TestimonioItem[]
}

export interface RedSocial {
  id: string
  platform: string
  url: string
  embedUrl?: string | null
  username: string
  followers: string
  active: boolean
  sortOrder: number
  updatedAt: string
}

export interface RedesData {
  id: string
  subtitle: string
  title: string
  description: string
  updatedAt: string
  items: RedSocial[]
}

export interface InfoData {
  id: string
  subtitle: string
  title: string
  description: string
  address: string
  phone: string
  email: string
  schedule: string
  scheduleWeekend: string
  mapUrl: string | null
  updatedAt: string
}

export interface FooterData {
  id: string
  description: string
  copyright: string
  updatedAt: string
}

export function getHeroData(): HeroData | null {
  return readContent<HeroData | null>('hero.json')
}

export function getVideoRankingData(): VideoRankingData | null {
  return readContent<VideoRankingData | null>('video-ranking.json')
}

export function getRankingData(): RankingItem[] | null {
  return readContent<RankingItem[] | null>('ranking.json')
}

export function getNosotrosData(): NosotrosData | null {
  return readContent<NosotrosData | null>('nosotros.json')
}

export function getNoticiasData(): NoticiasData | null {
  return readContent<NoticiasData | null>('noticias.json')
}

export function getTestimoniosData(): TestimoniosData | null {
  return readContent<TestimoniosData | null>('testimonios.json')
}

export function getRedesData(): RedesData | null {
  return readContent<RedesData | null>('redes.json')
}

export function getInfoData(): InfoData | null {
  return readContent<InfoData | null>('info.json')
}

export function getFooterData(): FooterData | null {
  return readContent<FooterData | null>('footer.json')
}

export function getAllSectionData() {
  return {
    hero: getHeroData(),
    videoRanking: getVideoRankingData(),
    ranking: getRankingData(),
    nosotros: getNosotrosData(),
    noticias: getNoticiasData(),
    testimonios: getTestimoniosData(),
    redes: getRedesData(),
    info: getInfoData(),
    footer: getFooterData(),
  }
}
