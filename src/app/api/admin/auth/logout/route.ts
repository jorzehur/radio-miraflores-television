import { getAdminUser } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const admin = await getAdminUser()
    if (admin) {
      await db.adminUser.update({
        where: { id: admin.id },
        data: { token: null },
      })
    }
  } catch {
    // Ignore errors during logout
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  return response
}