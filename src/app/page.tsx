import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import RankingSection from '@/components/sections/RankingSection'
import NosotrosSection from '@/components/sections/NosotrosSection'
import TestimoniosSection from '@/components/sections/TestimoniosSection'
import InfoSection from '@/components/sections/InfoSection'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { getAllSectionData } from '@/lib/ssr-data'

const VideoRankingSection = dynamic(() => import('@/components/sections/VideoRankingSection'))
const NoticiasSection = dynamic(() => import('@/components/sections/NoticiasSection'))
const RedesSection = dynamic(() => import('@/components/sections/RedesSection'))
const FooterSection = dynamic(() => import('@/components/sections/FooterSection'))

function SectionFallback({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      <span className="ml-3 text-sm font-medium text-gray-400">{label}</span>
    </div>
  )
}

export default async function Home() {
  const sectionData = await getAllSectionData()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection initialData={sectionData.hero} />

        <Suspense fallback={<SectionFallback label="Cargando video ranking..." />}>
          <VideoRankingSection initialData={sectionData.videoRanking} />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Cargando ranking..." />}>
          <RankingSection initialData={sectionData.ranking} />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Cargando..." />}>
          <NosotrosSection initialData={sectionData.nosotros} />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Cargando noticias..." />}>
          <NoticiasSection initialData={sectionData.noticias} />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Cargando..." />}>
          <TestimoniosSection initialData={sectionData.testimonios} />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Cargando..." />}>
          <RedesSection initialData={sectionData.redes} />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Cargando..." />}>
          <InfoSection initialData={sectionData.info} />
        </Suspense>
      </main>

      <Suspense fallback={<SectionFallback label="Cargando..." />}>
        <FooterSection
          initialFooter={sectionData.footer}
          initialRedes={sectionData.redes?.items}
          initialInfo={sectionData.info}
        />
      </Suspense>
    </div>
  )
}
