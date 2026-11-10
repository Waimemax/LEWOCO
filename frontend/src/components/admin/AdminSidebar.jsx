import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import lewocoLogo from '../../assets/images/LEWOCOLOGO.jpeg'
import './AdminSidebar.css'

const SUPER = ['super_admin']

// roles: who can see the link. Omitted = every administrator.
const navigation = [
  {
    title: 'MAIN MENU',
    links: [
      { name: 'Dashboard', path: '/admin', icon: '▦', end: true },
      { name: 'Members', path: '/admin/members', icon: '♙', roles: SUPER },
    ],
  },
  {
    title: 'ORGANIZATION',
    links: [
      { name: 'Programmes', path: '/admin/programmes', icon: '▤' },
      { name: 'Projects', path: '/admin/projects', icon: '◫' },
      { name: 'Training & Events', path: '/admin/events', icon: '▣' },
    ],
  },
  {
    title: 'CONTENT MANAGEMENT',
    links: [
      { name: 'News & Announcements', path: '/admin/news', icon: '▧' },
      { name: 'Resources', path: '/admin/resources', icon: '▱' },
      { name: 'Enquiries', path: '/admin/enquiries', icon: '✉' },
    ],
  },
  {
    title: 'SYSTEM',
    links: [
      { name: 'Reports', path: '/admin/reports', icon: '▥', roles: SUPER },
      { name: 'Settings', path: '/admin/settings', icon: '⚙', roles: SUPER },
    ],
  },
]

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  content_admin: 'Content Administrator',
}

function AdminSidebar() {
  const { user, logout } = useAuth()

  const visibleGroups = navigation
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => !link.roles || link.roles.includes(user?.role)),
    }))
    .filter((group) => group.links.length > 0)

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <img src={lewocoLogo} alt="LEWOCO Logo" />
        <div>
          <h2>LEWOCO</h2>
          <p>Administration</p>
        </div>
      </div>

      <nav className="admin-navigation">
        {visibleGroups.map((group) => (
          <div className="nav-group" key={group.title}>
            <p className="nav-group-title">{group.title}</p>

            {group.links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <p>{user?.name}</p>
        <span>{ROLE_LABELS[user?.role] || 'Administrator'}</span>
        <button type="button" className="admin-logout" onClick={logout}>
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
