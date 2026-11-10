import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>

  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />

  return <Outlet />
}
