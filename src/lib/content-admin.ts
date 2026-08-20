import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { commitFile } from './github'

const contentDir = join(process.cwd(), 'src', 'content')

export function readContentFile<T>(filename: string): T | null {
  try {
    const filePath = join(contentDir, filename)
    if (!existsSync(filePath)) return null
    const raw = readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`Error leyendo ${filename}:`, error)
    return null
  }
}

export function writeContentFile(filename: string, data: unknown): boolean {
  try {
    const filePath = join(contentDir, filename)
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`Error escribiendo ${filename}:`, error)
    return false
  }
}

export async function commitContentFile(filename: string, message: string): Promise<boolean> {
  const filePath = `src/content/${filename}`
  const data = readContentFile(filename)
  if (!data) return false
  
  const content = JSON.stringify(data, null, 2)
  return commitFile(filePath, content, message)
}

export function generateId(): string {
  return `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`
}
