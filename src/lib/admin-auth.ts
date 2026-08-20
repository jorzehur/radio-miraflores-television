import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@radiomiraflores.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export interface AdminUser {
  id: string
  email: string
  token: string
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null
    
    const storedEmail = cookieStore.get('admin_email')?.value
    if (storedEmail !== ADMIN_EMAIL) return null
    
    return {
      id: 'admin',
      email: ADMIN_EMAIL,
      token,
    }
  } catch {
    return null
  }
}

export function requireAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return handler(request)
  }
}

export function verifyCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export function generateToken(): string {
  return `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`
}
