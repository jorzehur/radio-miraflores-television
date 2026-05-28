import { db } from '@/lib/db'

function serialize(data: unknown): any {
  return JSON.parse(JSON.stringify(data))
}

export async function getHeroData() {
  const data = await db.heroSection.findFirst()
  return data ? serialize(data) : null
}

export async function getVideoRankingData() {
  const [section, items] = await Promise.all([
    db.videoRankingSection.findFirst(),
    db.videoRankingItem.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])
  return section ? serialize({ ...section, items }) : null
}

export async function getRankingData() {
  const data = await db.rankingItem.findMany({
    where: { active: true },
    orderBy: { position: 'asc' },
    take: 4,
  })
  return serialize(data)
}

export async function getNosotrosData() {
  const [section, cards] = await Promise.all([
    db.nosotrosSection.findFirst(),
    db.nosotrosCard.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])
  return section ? serialize({ ...section, cards }) : null
}

export async function getNoticiasData() {
  const [section, items] = await Promise.all([
    db.noticiasSection.findFirst(),
    db.noticiaItem.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])
  return section ? serialize({ ...section, items }) : null
}

export async function getTestimoniosData() {
  const [section, items] = await Promise.all([
    db.testimoniosSection.findFirst(),
    db.testimonioItem.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])
  return section ? serialize({ ...section, items }) : null
}

export async function getRedesData() {
  const [section, items] = await Promise.all([
    db.redesSection.findFirst(),
    db.redSocial.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])
  return section ? serialize({ ...section, items }) : null
}

export async function getInfoData() {
  const data = await db.infoSection.findFirst()
  return data ? serialize(data) : null
}

export async function getFooterData() {
  const data = await db.footerSection.findFirst()
  return data ? serialize(data) : null
}

export async function getAllSectionData() {
  const [hero, videoRanking, ranking, nosotros, noticias, testimonios, redes, info, footer] =
    await Promise.all([
      getHeroData(),
      getVideoRankingData(),
      getRankingData(),
      getNosotrosData(),
      getNoticiasData(),
      getTestimoniosData(),
      getRedesData(),
      getInfoData(),
      getFooterData(),
    ])

  return { hero, videoRanking, ranking, nosotros, noticias, testimonios, redes, info, footer }
}
