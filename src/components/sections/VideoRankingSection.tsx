'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Play, Radio, Volume2, VolumeX } from 'lucide-react'
import { buildYouTubeThumbnail } from '@/lib/youtube'
import Hls from 'hls.js'

interface VideoRankingItem {
  id: string
  title: string
  artist: string
  youtubeUrl: string
  videoId: string
  thumbnailUrl: string | null
  active: boolean
  sortOrder: number
  hlsUrl?: string | null
  downloadStatus?: string
}

interface VideoRankingData {
  id: string
  subtitle: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
  items: VideoRankingItem[]
}

const fallbackItems: VideoRankingItem[] = [
  { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', videoId: 'fJ9rUzIMcZQ', thumbnailUrl: buildYouTubeThumbnail('fJ9rUzIMcZQ'), active: true, sortOrder: 1 },
  { id: '2', title: 'Hotel California', artist: 'Eagles', youtubeUrl: 'https://www.youtube.com/watch?v=BciS5krYL80', videoId: 'BciS5krYL80', thumbnailUrl: buildYouTubeThumbnail('BciS5krYL80'), active: true, sortOrder: 2 },
  { id: '3', title: 'Stairway to Heaven', artist: 'Led Zeppelin', youtubeUrl: 'https://www.youtube.com/watch?v=QkF3oxziUI4', videoId: 'QkF3oxziUI4', thumbnailUrl: buildYouTubeThumbnail('QkF3oxziUI4'), active: true, sortOrder: 3 },
  { id: '4', title: 'Sweet Child O Mine', artist: 'Guns N Roses', youtubeUrl: 'https://www.youtube.com/watch?v=1w7OgIMMRc4', videoId: '1w7OgIMMRc4', thumbnailUrl: buildYouTubeThumbnail('1w7OgIMMRc4'), active: true, sortOrder: 4 },
  { id: '5', title: 'Smells Like Teen Spirit', artist: 'Nirvana', youtubeUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg', videoId: 'hTWKbfoikeg', thumbnailUrl: buildYouTubeThumbnail('hTWKbfoikeg'), active: true, sortOrder: 5 },
  { id: '6', title: 'November Rain', artist: 'Guns N Roses', youtubeUrl: 'https://www.youtube.com/watch?v=8SbUC-UaAxE', videoId: '8SbUC-UaAxE', thumbnailUrl: buildYouTubeThumbnail('8SbUC-UaAxE'), active: true, sortOrder: 6 },
  { id: '7', title: 'Livin on a Prayer', artist: 'Bon Jovi', youtubeUrl: 'https://www.youtube.com/watch?v=lDK9QqIzhwk', videoId: 'lDK9QqIzhwk', thumbnailUrl: buildYouTubeThumbnail('lDK9QqIzhwk'), active: true, sortOrder: 7 },
  { id: '8', title: 'Zombie', artist: 'The Cranberries', youtubeUrl: 'https://www.youtube.com/watch?v=6Ejga4kJUts', videoId: '6Ejga4kJUts', thumbnailUrl: buildYouTubeThumbnail('6Ejga4kJUts'), active: true, sortOrder: 8 },
  { id: '9', title: 'Enter Sandman', artist: 'Metallica', youtubeUrl: 'https://www.youtube.com/watch?v=CD-E-LDc384', videoId: 'CD-E-LDc384', thumbnailUrl: buildYouTubeThumbnail('CD-E-LDc384'), active: true, sortOrder: 9 },
  { id: '10', title: 'With or Without You', artist: 'U2', youtubeUrl: 'https://www.youtube.com/watch?v=XmSdTa9kaiQ', videoId: 'XmSdTa9kaiQ', thumbnailUrl: buildYouTubeThumbnail('XmSdTa9kaiQ'), active: true, sortOrder: 10 },
]

const fallbackData: VideoRankingData = {
  id: 'default',
  subtitle: 'Ranking en video',
  title: 'Video Ranking',
  description: 'Una programacion continua con los videos de YouTube que mas suenan en Radio Miraflores',
  ctaText: 'Abrir canal en YouTube',
  ctaLink: 'https://www.youtube.com/@RADIOMIRAFLORESTELEVISION',
  items: fallbackItems,
}

export default function VideoRankingSection({ initialData }: { initialData?: VideoRankingData | null }) {
  const [data, setData] = useState<VideoRankingData>(initialData ?? fallbackData)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    if (initialData) return
    let isMounted = true

    async function fetchData() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)
        const res = await fetch('/api/public/video-ranking', { signal: controller.signal })
        clearTimeout(timeout)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()

        if (!isMounted) return
        if (json && Array.isArray(json.items) && json.items.length > 0) {
          setData({
            id: json.id || fallbackData.id,
            subtitle: json.subtitle || fallbackData.subtitle,
            title: json.title || fallbackData.title,
            description: json.description || fallbackData.description,
            ctaText: json.ctaText || fallbackData.ctaText,
            ctaLink: json.ctaLink || fallbackData.ctaLink,
            items: json.items,
          })
        }
      } catch {
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [])

  const activeItems = useMemo(
    () => (data.items?.filter(item => item.active !== false).length ? data.items.filter(item => item.active !== false) : fallbackItems),
    [data.items]
  )

  const currentVideo = activeItems[currentIndex] || activeItems[0]

   useEffect(() => {
     if (currentIndex >= activeItems.length) {
       setCurrentIndex(prev => 0)
     }
   }, [activeItems.length, currentIndex])

  const hasHls = currentVideo?.hlsUrl && currentVideo.downloadStatus === 'ready'

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasHls || !currentVideo?.hlsUrl) return

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    video.muted = true
    video.volume = 1

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(currentVideo.hlsUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = isMuted
        video.play().catch(() => {})
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentVideo.hlsUrl
      video.addEventListener('canplay', () => {
        video.muted = isMuted
        video.play().catch(() => {})
      }, { once: true })
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [currentVideo?.id, hasHls])

  useEffect(() => {
    const video = videoRef.current
    if (video && hasHls) {
      video.muted = isMuted
    }
  }, [isMuted, hasHls])

  const currentVideoId = currentVideo?.videoId
  const playlistIds = useMemo(() => activeItems.map(item => item.videoId).filter(Boolean), [activeItems])
  const playlistParam = useMemo(() => playlistIds.join(','), [playlistIds])
  const iframeSrc = useMemo(() => {
    if (!currentVideoId || hasHls) return ''
    const params = new URLSearchParams({
      autoplay: '1',
      mute: isMuted ? '1' : '0',
      controls: '1',
      rel: '0',
      playsinline: '1',
      loop: '1',
      playlist: playlistParam,
      enablejsapi: '0',
    })
    return `https://www.youtube.com/embed/${currentVideoId}?${params.toString()}`
  }, [currentVideoId, hasHls, playlistParam, isMuted])

  function playVideoAt(index: number) {
    setCurrentIndex(index)
  }

  function toggleMute() {
    setIsMuted(prev => !prev)
  }

  return (
    <section id="video-ranking" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(139,26,43,0.12),_transparent_32%),linear-gradient(180deg,#fff7f8_0%,#ffffff_42%,#fff5eb_100%)] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-12 h-72 w-72 rounded-full bg-[#8B1A2B]/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-140px] h-80 w-80 rounded-full bg-[#f59e0b]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8B1A2B]/10 px-4 py-1.5">
              <Radio className="h-4 w-4 text-[#8B1A2B]" />
              <span className="text-sm font-semibold text-[#8B1A2B]">{data.subtitle}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
              {data.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg font-medium text-gray-600">
              {data.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleMute}
              className="inline-flex items-center gap-2 rounded-full border border-[#8B1A2B]/15 bg-white px-5 py-3 text-sm font-semibold text-[#8B1A2B] shadow-sm transition hover:border-[#8B1A2B]/30 hover:bg-[#8B1A2B]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isMuted ? 'Activar sonido' : 'Silenciar'}
            </button>
            <a
              href={data.ctaLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#8B1A2B] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8B1A2B]/20 transition hover:bg-[#6B0F1E]"
            >
              {data.ctaText}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.95fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[28px] border border-[#8B1A2B]/10 bg-white/90 shadow-[0_30px_80px_rgba(139,26,43,0.12)] backdrop-blur-sm"
          >
            <div className="border-b border-[#8B1A2B]/10 px-5 py-4 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8B1A2B]/70">En reproducción</p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">{currentVideo?.title || 'Video destacado'}</h3>
                  <p className="truncate text-sm font-medium text-gray-500">{currentVideo?.artist || 'Radio Miraflores TV'}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {hasHls ? 'Streaming local' : 'Reproducción continua'}
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="overflow-hidden rounded-2xl bg-black shadow-inner">
                <div className="aspect-video w-full">
                  {hasHls ? (
                    <video
                      ref={videoRef}
                      className="h-full w-full"
                      playsInline
                      loop
                      controls
                    />
                  ) : iframeSrc ? (
                    <iframe
                      key={`${currentVideoId}-${isMuted ? 'muted' : 'sound'}`}
                      src={iframeSrc}
                      title={currentVideo?.title || 'Video Ranking'}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-white/70">
                      Cargando reproductor...
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">
                {isLoading ? 'Cargando playlist...' : hasHls ? 'Reproduciendo desde servidor local — sin bloqueos ni demoras.' : 'Autoplay continuo en mute por compatibilidad. El audio se activa con tu interacción.'}
              </p>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="overflow-hidden rounded-[28px] border border-[#8B1A2B]/10 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-sm"
          >
            <div className="border-b border-[#8B1A2B]/10 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8B1A2B]/70">Playlist activa</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{activeItems.length} videos en cola</h3>
                </div>
                <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#8B1A2B] px-3 text-sm font-bold text-white">
                  24/7
                </div>
              </div>
            </div>
            <div className="max-h-[720px] overflow-y-auto p-3 sm:p-4">
              <div className="space-y-3">
                {activeItems.map((item, index) => {
                  const isCurrent = index === currentIndex
                  return (
                    <button
                      key={item.id}
                      onClick={() => playVideoAt(index)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${isCurrent ? 'border-[#8B1A2B]/40 bg-[#8B1A2B]/6 shadow-sm' : 'border-gray-100 bg-white hover:border-[#8B1A2B]/20 hover:bg-[#fff7f8]'}`}
                    >
                      <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <Image src={item.thumbnailUrl || buildYouTubeThumbnail(item.videoId)} alt={item.title} fill className="object-cover" sizes="128px" />
                        <div className={`absolute inset-0 flex items-center justify-center ${isCurrent ? 'bg-[#8B1A2B]/35' : 'bg-black/20'}`}>
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#8B1A2B] shadow-md">
                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500">
                          #{index + 1}
                          {isCurrent && <span className="text-[#8B1A2B]">Ahora</span>}
                        </div>
                        <p className="line-clamp-2 font-semibold text-gray-900">{item.title}</p>
                        <p className="mt-1 truncate text-sm font-medium text-gray-500">{item.artist || 'Radio Miraflores TV'}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
