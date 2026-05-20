import { getPosts } from '@/lib/wordpress'
import NoticiasSectionClient from './NoticiasSectionClient'

// Datos de fallback si WordPress no está disponible
const fallbackNoticias = [
  {
    id: 1,
    name: 'Radio Miraflores TV',
    time: 'Hace 2 horas',
    content: '🎸 ¡NO TE LO PIERDAS! Esta noche a las 8:00 PM estrenamos entrevista exclusiva con la banda de rock alternativo que está revolucionando la escena musical. Prepárate para una noche llena de rock en vivo y sorpresas. ¡Sintoniza! 🔥🎶 #RockEnVivo #RadioMiraflores',
    image: '/images/hero-radio-studio.png',
    likes: 245,
    comments: 38,
    shares: 56,
    color: 'from-[#8B1A2B] to-[#A63346]',
  },
  {
    id: 2,
    name: 'Radio Miraflores TV',
    time: 'Hace 5 horas',
    content: '🏆 ¡NUEVO LÍDER DEL RANKING! "Bohemian Rhapsody" de Queen vuelve a coronarse en el #1 de nuestro Ranking Internacional de Rock. ¿Estás de acuerdo con esta posición? ¡Comenta y comparte tu opinión! La voz de nuestros oyentes es lo que más importa 🤘📻 #RankingRock #Queen',
    image: '/images/hero-video-thumb.png',
    likes: 412,
    comments: 89,
    shares: 127,
    color: 'from-[#F5A623] to-[#FFD166]',
  },
]

export default async function NoticiasSection() {
  let noticias = fallbackNoticias

  try {
    const posts = await getPosts(1, 2)
    if (posts.length > 0) {
      noticias = posts.map((post, index) => ({
        id: post.id,
        name: 'Radio Miraflores TV',
        time: new Date(post.date).toLocaleDateString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
        }),
        content: post.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackNoticias[index]?.image || '/images/hero-radio-studio.png',
        likes: Math.floor(Math.random() * 400) + 100,
        comments: Math.floor(Math.random() * 80) + 10,
        shares: Math.floor(Math.random() * 120) + 20,
        color: index % 2 === 0 ? 'from-[#8B1A2B] to-[#A63346]' : 'from-[#F5A623] to-[#FFD166]',
      }))
    }
  } catch {
    // Usar fallback data
  }

  return <NoticiasSectionClient noticias={noticias} />
}
