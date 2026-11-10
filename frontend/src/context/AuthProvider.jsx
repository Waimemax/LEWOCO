import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { api, clearToken, getToken, setToken, setUnauthorizedHandler } from '../lib/api'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  const forgetSession = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  // Restore the session on page load
  useEffect(() => {
    setUnauthorizedHandler(forgetSession)

    if (!getToken()) return

    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(forgetSession)
      .finally(() => setLoading(false))
  }, [forgetSession])

  const login = useCallback(async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } })
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // Token may already be invalid; clear locally either way
    }
    forgetSession()
  }, [forgetSession])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
