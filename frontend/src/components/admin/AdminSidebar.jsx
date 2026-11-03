
import { NavLink } from 'react-router-dom'
import lewocoLogo from '../../assets/images/LEWOCOLOGO.jpeg'
import './AdminSidebar.css'

const navigation = [
  {
    title: 'MAIN MENU',
    links: [
      { name: 'Dashboard', path: '/admin', icon: '▦', end: true },
      { name: 'Members', path: '/admin/members', icon: '♙' },
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
      { name: 'Reports', path: '/admin/reports', icon: '▥' },
      { name: 'Settings', path: '/admin/settings', icon: '⚙' },
    ],
  },
]

function AdminSidebar() {
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
        {navigation.map((group) => (
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
        <p>LEWOCO Administration</p>
        <span>Organizational Management System</span>
      </div>
    </aside>
  )
}

export default AdminSidebar
