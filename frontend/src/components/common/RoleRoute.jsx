import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Use inside ProtectedRoute. Sends users without the right role back to the dashboard.
export default function RoleRoute({ roles }) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) return <Navigate to="/admin" replace />

  return <Outlet />
}
