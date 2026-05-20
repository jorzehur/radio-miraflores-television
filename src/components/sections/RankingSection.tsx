import { getRanking } from '@/lib/wordpress'
import RankingSectionClient from './RankingSectionClient'

// Datos de fallback si WordPress no está disponible
const fallbackRanking = [
  {
    position: 1,
    song: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    weeks: 12,
    trend: 'up' as const,
    color: 'from-yellow-400 to-amber-500',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    borderColor: 'border-yellow-200',
  },
  {
    position: 2,
    song: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    weeks: 8,
    trend: 'up' as const,
    color: 'from-gray-300 to-gray-400',
    bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
    borderColor: 'border-gray-200',
  },
  {
    position: 3,
    song: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    weeks: 15,
    trend: 'same' as const,
    color: 'from-amber-600 to-amber-700',
    bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    position: 4,
    song: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: 'Appetite for Destruction',
    weeks: 6,
    trend: 'up' as const,
    color: 'from-[#8B1A2B] to-[#A63346]',
    bgColor: 'bg-gradient-to-br from-[#FDF2F4] to-[#FCE7EB]',
    borderColor: 'border-[#FCE7EB]',
  },
]

const cardStyles = [
  { color: 'from-yellow-400 to-amber-500', bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50', borderColor: 'border-yellow-200' },
  { color: 'from-gray-300 to-gray-400', bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50', borderColor: 'border-gray-200' },
  { color: 'from-amber-600 to-amber-700', bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50', borderColor: 'border-amber-200' },
  { color: 'from-[#8B1A2B] to-[#A63346]', bgColor: 'bg-gradient-to-br from-[#FDF2F4] to-[#FCE7EB]', borderColor: 'border-[#FCE7EB]' },
]

export default async function RankingSection() {
  let ranking = fallbackRanking

  try {
    const wpRanking = await getRanking(4)
    if (wpRanking.length > 0) {
      ranking = wpRanking.map((entry, index) => ({
        position: entry.acf?.posicion || index + 1,
        song: entry.acf?.cancion || entry.title.rendered,
        artist: entry.acf?.artista || 'Artista',
        album: entry.acf?.album || 'Album',
        weeks: entry.acf?.semanas_en_ranking || 1,
        trend: entry.acf?.tendencia === 'sube' ? 'up' as const : entry.acf?.tendencia === 'baja' ? 'down' as const : 'same' as const,
        ...cardStyles[index % cardStyles.length],
      }))
    }
  } catch {
    // Usar fallback data
  }

  return <RankingSectionClient ranking={ranking} />
}
