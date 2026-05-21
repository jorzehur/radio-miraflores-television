import { cookies } from 'next/headers'
import { db } from './db'

export async function getAdminUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null
    const admin = await db.adminUser.findUnique({ where: { id: token } })
    return admin
  } catch {
    return null
  }
}
