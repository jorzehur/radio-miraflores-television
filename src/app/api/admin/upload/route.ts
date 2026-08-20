import { NextRequest, NextResponse } from 'next/server'
import { commitBinaryFile } from '@/lib/github'

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
    }

    if (file.size > 500 * 1024) {
      return NextResponse.json({ error: 'Image too large (max 500KB)' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'png'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`
    const path = `public/images/uploads/${filename}`

    const buffer = await file.arrayBuffer()
    const base64 = arrayBufferToBase64(buffer)

    const success = await commitBinaryFile(path, base64, `Upload image ${filename}`)

    if (!success) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const url = `/images/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
