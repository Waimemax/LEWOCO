const TOKEN_KEY = 'lewoco_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData

  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      // For FormData (file uploads) the browser sets the content type itself
      ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (response.status === 401 && token) onUnauthorized()

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong.')
    error.status = response.status
    error.errors = data.errors
    throw error
  }

  return data
}
