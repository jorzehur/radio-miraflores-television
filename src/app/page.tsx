import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import RankingSection from '@/components/sections/RankingSection'
import NosotrosSection from '@/components/sections/NosotrosSection'
import NoticiasSection from '@/components/sections/NoticiasSection'
import TestimoniosSection from '@/components/sections/TestimoniosSection'
import RedesSection from '@/components/sections/RedesSection'
import InfoSection from '@/components/sections/InfoSection'
import FooterSection from '@/components/sections/FooterSection'
import AdminPanel from '@/components/AdminPanel'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <RankingSection />
        <NosotrosSection />
        <NoticiasSection />
        <TestimoniosSection />
        <RedesSection />
        <InfoSection />
      </main>
      <FooterSection />
      <AdminPanel />
    </div>
  )
}
