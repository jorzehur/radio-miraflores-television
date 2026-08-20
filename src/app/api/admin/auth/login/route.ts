import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import crypto from 'crypto'

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

    const token = crypto.randomUUID()
    await db.adminUser.update({
      where: { id: admin.id },
      data: { token },
    })

    const response = NextResponse.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email } })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}