import { API_BASE_URL } from '../config/constants'

async function request(method, path, body) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.mensagem || 'Erro na requisição')
  }
  return res.json()
}

export const api = {
  get:   (path)       => request('GET',   path),
  post:  (path, body) => request('POST',  path, body),
  patch: (path, body) => request('PATCH', path, body),
}
