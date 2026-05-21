import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const admin = await db.adminUser.findUnique({ where: { email } })
    if (!admin) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const valid = await compare(password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email } })
    response.cookies.set('admin_token', admin.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
