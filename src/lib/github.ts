const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO || 'jorzehur/radio-miraflores-television'
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'

interface GitHubFileResponse {
  sha: string
  content?: string
}

async function githubApi(path: string, options: RequestInit = {}) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return res
}

async function getFileSha(path: string): Promise<string | null> {
  const res = await githubApi(path)
  if (!res.ok) return null
  const data: GitHubFileResponse = await res.json()
  return data.sha
}

export async function commitFile(path: string, content: string, message: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN no configurado')
    return false
  }

  try {
    const sha = await getFileSha(path)
    const body: Record<string, string> = {
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch: GITHUB_BRANCH,
    }
    if (sha) body.sha = sha

    const res = await githubApi(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    })

    return res.ok
  } catch (error) {
    console.error('Error al hacer commit:', error)
    return false
  }
}

export async function deleteFile(path: string, message: string): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN no configurado')
    return false
  }

  try {
    const sha = await getFileSha(path)
    if (!sha) return false

    const res = await githubApi(path, {
      method: 'DELETE',
      body: JSON.stringify({
        message,
        sha,
        branch: GITHUB_BRANCH,
      }),
    })

    return res.ok
  } catch (error) {
    console.error('Error al eliminar archivo:', error)
    return false
  }
}
