import { cookies } from 'next/headers'
import { db } from './db'
import { NextRequest, NextResponse } from 'next/server'

export async function getAdminUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null
    const admin = await db.adminUser.findFirst({ where: { token } })
    return admin
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
