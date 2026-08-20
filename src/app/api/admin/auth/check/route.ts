import { getAdminUser } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await getAdminUser()
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, admin: { id: admin.id, name: 'Administrador', email: admin.email } })
}
