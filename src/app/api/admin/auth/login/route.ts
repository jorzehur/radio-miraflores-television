import { verifyCredentials, generateToken } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@radiomiraflores.com'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const valid = verifyCredentials(email, password)
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = generateToken()

    const response = NextResponse.json({ 
      success: true, 
      admin: { id: 'admin', name: 'Administrador', email: ADMIN_EMAIL } 
    })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    response.cookies.set('admin_email', ADMIN_EMAIL, {
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
