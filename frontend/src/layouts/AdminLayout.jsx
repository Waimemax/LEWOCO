import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import { useAuth } from '../hooks/useAuth'
import './AdminLayout.css'

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  content_admin: 'Content Administrator',
}

function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <h2>Administration Portal</h2>
            <p>Manage LEWOCO organizational activities</p>
          </div>

          <div className="admin-header-user">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h4>{user?.name || 'Administrator'}</h4>
              <span>{ROLE_LABELS[user?.role] || 'Administrator'}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
