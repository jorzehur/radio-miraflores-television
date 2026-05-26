import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { db } from './db'

const VIDEOS_DIR = path.resolve(process.cwd(), 'public', 'videos', 'ranking')
const ytDlpPath = path.resolve(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp.exe')
const ffmpegPath = path.resolve(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe')

function getVideoDir(videoId: string) {
  return path.join(VIDEOS_DIR, videoId)
}

export async function downloadAndTranscode(videoId: string, youtubeUrl: string) {
  const videoDir = getVideoDir(videoId)
  fs.mkdirSync(videoDir, { recursive: true })

  const tempInput = path.join(videoDir, 'input.mp4')
  const playlistPath = path.join(videoDir, 'playlist.m3u8')
  const segmentPath = path.join(videoDir, 'segment%d.ts')

  try {
    await db.videoRankingItem.update({
      where: { id: videoId },
      data: { downloadStatus: 'downloading', downloadError: null },
    })

    execSync(
      `"${ytDlpPath}" -f "best[height<=720]" -o "${tempInput}" "${youtubeUrl}"`,
      { timeout: 300000, windowsHide: true }
    )

    await db.videoRankingItem.update({
      where: { id: videoId },
      data: { downloadStatus: 'transcoding' },
    })

    execSync(
      `"${ffmpegPath}" -i "${tempInput}" -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" -c:v libx264 -preset fast -crf 28 -c:a aac -b:a 128k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${segmentPath}" "${playlistPath}"`,
      { timeout: 300000, windowsHide: true }
    )

    fs.unlinkSync(tempInput)

    const hlsUrl = `/videos/ranking/${videoId}/playlist.m3u8`

    await db.videoRankingItem.update({
      where: { id: videoId },
      data: {
        hlsUrl,
        downloadStatus: 'ready',
        downloadError: null,
      },
    })

    return { success: true, hlsUrl }
  } catch (err: any) {
    const errorMsg = err?.stderr?.toString() || err?.message || 'Error desconocido'

    try { fs.unlinkSync(tempInput) } catch { /* ignore */ }

    await db.videoRankingItem.update({
      where: { id: videoId },
      data: { downloadStatus: 'failed', downloadError: errorMsg },
    })

    return { success: false, error: errorMsg }
  }
}
