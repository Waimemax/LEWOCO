
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import './AdminLayout.css'

function AdminLayout() {
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
            <div className="admin-user-avatar">A</div>

            <div>
              <h4>Administrator</h4>
              <span>System Admin</span>
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
