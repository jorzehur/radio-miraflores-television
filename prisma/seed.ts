import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando base de datos...')

  // 1. Admin User
  const existingAdmin = await prisma.adminUser.findFirst()
  if (!existingAdmin) {
    const hashedPassword = await hash('admin123', 10)
    await prisma.adminUser.create({
      data: { email: 'admin@radiomiraflores.com', password: hashedPassword, name: 'Administrador' }
    })
    console.log('✅ Admin user creado')
  }

  // 2. Hero Section
  const existingHero = await prisma.heroSection.findFirst()
  if (!existingHero) {
    await prisma.heroSection.create({
      data: {
        title: 'Radio Miraflores',
        titleHighlight: 'Televisión',
        subtitle: 'La estación de rock que mueve tu mundo 🎸🔥',
        ctaPrimaryText: 'Ver Ranking',
        ctaPrimaryLink: '#ranking',
        ctaSecondaryText: 'Últimas Noticias',
        ctaSecondaryLink: '#noticias',
        backgroundImage: '/images/hero-radio-studio.png',
        overlayColor: 'from-[#B3E5FC]/85 via-[#81D4FA]/75 to-[#4FC3F7]/90',
      }
    })
    console.log('✅ Hero Section creada')
  }

  // 3. Ranking Items
  const existingRanking = await prisma.rankingItem.count()
  if (existingRanking === 0) {
    await prisma.rankingItem.createMany({
      data: [
        { position: 1, song: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', weeks: 12, trend: 'up' },
        { position: 2, song: 'Hotel California', artist: 'Eagles', album: 'Hotel California', weeks: 8, trend: 'up' },
        { position: 3, song: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', weeks: 15, trend: 'same' },
        { position: 4, song: "Sweet Child O' Mine", artist: "Guns N' Roses", album: 'Appetite for Destruction', weeks: 6, trend: 'up' },
      ]
    })
    console.log('✅ Ranking Items creados')
  }

  // 4. Nosotros Section
  const existingNosotros = await prisma.nosotrosSection.findFirst()
  if (!existingNosotros) {
    await prisma.nosotrosSection.create({
      data: {
        subtitle: 'Nuestra Historia',
        title: 'Nosotros',
        description: 'Décadas de rock, pasión y música que conecta corazones',
        stat1Value: '39+', stat1Label: 'Años al aire',
        stat2Value: '50K+', stat2Label: 'Oyentes',
        stat3Value: '100+', stat3Label: 'Programas',
        stat4Value: '∞', stat4Label: 'Pasión rockera',
      }
    })
    console.log('✅ Nosotros Section creada')
  }

  // 5. Nosotros Cards
  const existingCards = await prisma.nosotrosCard.count()
  if (existingCards === 0) {
    await prisma.nosotrosCard.createMany({
      data: [
        { year: '1985', title: 'Los Inicios', description: 'Donde todo comenzó. Una pequeña cabina con grandes sueños y la pasión por el rock que nos unió.', imageUrl: '/images/nosotros-80s.png', icon: 'radio', sortOrder: 1 },
        { year: '1995', title: 'La Evolución', description: 'La tecnología cambió, pero nuestra esencia rockera se mantuvo firme. Llegamos a más oyentes con nueva energía.', imageUrl: '/images/nosotros-90s.png', icon: 'mic', sortOrder: 2 },
        { year: '2010', title: 'Era Digital', description: 'La revolución digital nos impulsó al mundo entero. Streaming, podcasts y más rock para todos.', imageUrl: '/images/nosotros-2000s.png', icon: 'headphones', sortOrder: 3 },
        { year: '2024', title: 'Hoy', description: 'Más fuertes que nunca. Conectando generaciones a través de la música que nos define.', imageUrl: '/images/nosotros-2020s.png', icon: 'heart', sortOrder: 4 },
      ]
    })
    console.log('✅ Nosotros Cards creados')
  }

  // 6. Noticias Section
  const existingNoticiasSection = await prisma.noticiasSection.findFirst()
  if (!existingNoticiasSection) {
    await prisma.noticiasSection.create({
      data: {
        subtitle: 'Últimas Noticias',
        title: 'Noticias',
        description: 'Mantente informado de todo lo que pasa en el mundo del rock',
        maxVisible: 2,
      }
    })
    console.log('✅ Noticias Section creada')
  }

  // 7. Noticia Items
  const existingNoticias = await prisma.noticiaItem.count()
  if (existingNoticias === 0) {
    await prisma.noticiaItem.createMany({
      data: [
        {
          title: 'Dia del Vino',
          excerpt: '',
          content: '',
          author: 'Radio Miraflores TV',
          facebookEmbedUrl: 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fradiomiraflorestelevision%2Fposts%2Fpfbid02uRk3eRAGLoSpX6DtULxF9d7PtFTkynQkyonRf7vwguCGoWo9qAXwn41a9Qdv3vvyl&show_text=true&width=500',
          published: true,
          sortOrder: 1,
        },
        {
          title: '¡Estreno exclusivo! Entrevista con la banda de rock alternativo del momento',
          excerpt: 'Esta noche a las 8:00 PM estrenamos entrevista exclusiva con la banda de rock alternativo que está revolucionando la escena musical. Prepárate para una noche llena de rock en vivo y sorpresas. ¡Sintoniza! #RockEnVivo #RadioMiraflores',
          content: 'Esta noche a las 8:00 PM estrenamos entrevista exclusiva con la banda de rock alternativo que está revolucionando la escena musical. Prepárate para una noche llena de rock en vivo y sorpresas. ¡Sintoniza! #RockEnVivo #RadioMiraflores',
          imageUrl: '/images/hero-radio-studio.png',
          author: 'Radio Miraflores TV',
          published: true,
          sortOrder: 2,
        },
        {
          title: '¡Nuevo líder del Ranking Internacional! Bohemian Rhapsody vuelve al #1',
          excerpt: '«Bohemian Rhapsody» de Queen vuelve a coronarse en el #1 de nuestro Ranking Internacional de Rock. ¿Estás de acuerdo con esta posición? ¡Comenta y comparte tu opinión! #RankingRock #Queen',
          content: '«Bohemian Rhapsody» de Queen vuelve a coronarse en el #1 de nuestro Ranking Internacional de Rock. ¿Estás de acuerdo con esta posición? ¡Comenta y comparte tu opinión! #RankingRock #Queen',
          imageUrl: '/images/hero-video-thumb.png',
          author: 'Radio Miraflores TV',
          published: true,
          sortOrder: 3,
        },
      ]
    })
    console.log('✅ Noticia Items creados')
  }

  // 8. Testimonios Section
  const existingTestimoniosSection = await prisma.testimoniosSection.findFirst()
  if (!existingTestimoniosSection) {
    await prisma.testimoniosSection.create({
      data: {
        subtitle: 'Lo que dicen nuestros oyentes',
        title: 'Testimonios',
        description: 'Historias reales de quienes viven la magia de la radio',
      }
    })
    console.log('✅ Testimonios Section creada')
  }

  // 9. Testimonio Items
  const existingTestimonios = await prisma.testimonioItem.count()
  if (existingTestimonios === 0) {
    await prisma.testimonioItem.createMany({
      data: [
        {
          name: 'María García',
          role: 'Oyente desde 2005',
          quote: 'Radio Miraflores Televisión ha sido la banda sonora de mi vida. Desde que la descubrí, cada mañana empieza con la energía que solo el rock y esta radio pueden dar. Los locutores son increíbles, la selección musical es perfecta y me siento parte de una gran familia de rockeros. ¡No puedo imaginar mi día sin sintonizarlos!',
          imageUrl: '/images/testimonio-1.png',
          rating: 5,
          sortOrder: 1,
        },
        {
          name: 'Carlos Mendoza',
          role: 'Oyente desde 2010',
          quote: 'Desde que sintonizo Radio Miraflores, mi día a día cambió por completo. La música, la energía y la pasión que transmiten es incomparable. Cada programa es una experiencia única que me hace sentir vivo. Gracias por tantos años de rock de calidad.',
          imageUrl: '/images/testimonio-2.png',
          rating: 5,
          sortOrder: 2,
        },
      ]
    })
    console.log('✅ Testimonio Items creados')
  }

  // 10. Redes Section
  const existingRedesSection = await prisma.redesSection.findFirst()
  if (!existingRedesSection) {
    await prisma.redesSection.create({
      data: {
        subtitle: 'Síguenos',
        title: 'Redes Sociales',
        description: 'Conecta con nosotros en todas las plataformas',
      }
    })
    console.log('✅ Redes Section creada')
  }

  // 11. Redes Sociales
  const existingRedes = await prisma.redSocial.count()
  if (existingRedes === 0) {
    await prisma.redSocial.createMany({
      data: [
        { platform: 'facebook', url: 'https://facebook.com/radiomiraflorestelevision', username: '@radiomiraflorestelevision', followers: '50K seguidores', sortOrder: 1 },
        { platform: 'instagram', url: 'https://instagram.com/radiomiraflorestelevision', username: '@radiomiraflorestelevision', followers: '25K seguidores', sortOrder: 2 },
        { platform: 'tiktok', url: 'https://tiktok.com/@radiomiraflorestelevision', username: '@radiomiraflorestelevision', followers: '15K seguidores', sortOrder: 3 },
        { platform: 'youtube', url: 'https://youtube.com/@radiomiraflorestelevision', username: '@radiomiraflorestelevision', followers: '10K suscriptores', sortOrder: 4 },
        { platform: 'twitter', url: 'https://x.com/radiomiraflores', username: '@radiomiraflores', followers: '8K seguidores', sortOrder: 5 },
      ]
    })
    console.log('✅ Redes Sociales creadas')
  }

  // 12. Info Section
  const existingInfo = await prisma.infoSection.findFirst()
  if (!existingInfo) {
    await prisma.infoSection.create({
      data: {
        subtitle: 'Contáctanos',
        title: 'Información',
        description: 'Estamos aquí para escucharte',
        address: 'Miraflores, Lima, Perú',
        phone: '+51 01 234 5678',
        email: 'contacto@radiomiraflores.com',
        schedule: 'Lunes a Viernes: 6:00 AM - 12:00 AM',
        scheduleWeekend: 'Sábados y Domingos: 8:00 AM - 10:00 PM',
      }
    })
    console.log('✅ Info Section creada')
  }

  // 13. Footer Section
  const existingFooter = await prisma.footerSection.findFirst()
  if (!existingFooter) {
    await prisma.footerSection.create({
      data: {
        description: 'La estación de rock que mueve tu mundo desde 1985.',
        copyright: '© 2024 Radio Miraflores Televisión. Todos los derechos reservados.',
      }
    })
    console.log('✅ Footer Section creada')
  }

  console.log('🎉 Base de datos sembrada exitosamente!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
