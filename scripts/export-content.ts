import { PrismaClient } from '@prisma/client'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const db = new PrismaClient()
const outDir = join(process.cwd(), 'src', 'content')
mkdirSync(outDir, { recursive: true })

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

async function main() {
  const [hero, videoRankingSection, videoRankingItems, ranking, nosotrosSection, nosotrosCards, noticiasSection, noticiaItems, testimoniosSection, testimonioItems, redesSection, redesItems, info, footer] =
    await Promise.all([
      db.heroSection.findFirst(),
      db.videoRankingSection.findFirst(),
      db.videoRankingItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.rankingItem.findMany({ orderBy: { position: 'asc' } }),
      db.nosotrosSection.findFirst(),
      db.nosotrosCard.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.noticiasSection.findFirst(),
      db.noticiaItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.testimoniosSection.findFirst(),
      db.testimonioItem.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.redesSection.findFirst(),
      db.redSocial.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.infoSection.findFirst(),
      db.footerSection.findFirst(),
    ])

  const files: Record<string, unknown> = {
    'hero.json': serialize(hero),
    'video-ranking.json': serialize(videoRankingSection ? { ...videoRankingSection, items: videoRankingItems } : null),
    'ranking.json': serialize(ranking),
    'nosotros.json': serialize(nosotrosSection ? { ...nosotrosSection, cards: nosotrosCards } : null),
    'noticias.json': serialize(noticiasSection ? { ...noticiasSection, items: noticiaItems } : null),
    'testimonios.json': serialize(testimoniosSection ? { ...testimoniosSection, items: testimonioItems } : null),
    'redes.json': serialize(redesSection ? { ...redesSection, items: redesItems } : null),
    'info.json': serialize(info),
    'footer.json': serialize(footer),
  }

  for (const [name, data] of Object.entries(files)) {
    writeFileSync(join(outDir, name), JSON.stringify(data, null, 2), 'utf-8')
    console.log(`✓ ${name}`)
  }

  await db.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
