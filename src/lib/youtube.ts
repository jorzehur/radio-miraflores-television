export function extractYouTubeVideoId(input: string) {
  if (!input) return null

  const trimmed = input.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '')
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }

    if (url.hostname.includes('youtube.com')) {
      const watchId = url.searchParams.get('v')
      if (watchId && /^[a-zA-Z0-9_-]{11}$/.test(watchId)) return watchId

      const parts = url.pathname.split('/').filter(Boolean)
      const candidate = parts[1] && ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : null
      if (candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate)) return candidate
    }
  } catch {
    return null
  }

  return null
}

export function buildYouTubeThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}
