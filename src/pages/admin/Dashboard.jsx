
import { Link } from 'react-router-dom'
import './Dashboard.css'

const overviewCards = [
  {
    title: 'Registered Members',
    value: '—',
    note: 'Awaiting member records',
    icon: '♙',
  },
  {
    title: 'Active Programmes',
    value: '—',
    note: 'Awaiting programme records',
    icon: '▤',
  },
  {
    title: 'Ongoing Projects',
    value: '—',
    note: 'Awaiting project records',
    icon: '◫',
  },
  {
    title: 'Upcoming Events',
    value: '—',
    note: 'Awaiting event records',
    icon: '▣',
  },
]

const quickActions = [
  { title: 'Add a Member', description: 'Register a new cooperative member', path: '/admin/members', icon: '♙' },
  { title: 'Create a Programme', description: 'Set up an organizational programme', path: '/admin/programmes', icon: '▤' },
  { title: 'Add a Project', description: 'Record a community project', path: '/admin/projects', icon: '◫' },
  { title: 'Publish an Update', description: 'Create news or an announcement', path: '/admin/news', icon: '▧' },
]

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Welcome to the LEWOCO administration portal.</p>
        </div>
        <div className="dashboard-date">
          <span>ORGANIZATION</span>
          <strong>LEWOCO</strong>
        </div>
      </div>

      <section className="dashboard-stats">
        {overviewCards.map((card) => (
          <article className="dashboard-stat-card" key={card.title}>
            <div className="stat-card-top">
              <span className="stat-icon">{card.icon}</span>
              <span className="stat-status">Pending data</span>
            </div>
            <h3>{card.title}</h3>
            <strong className="stat-value">{card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-lower">
        <div className="dashboard-panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest actions recorded in the system</p>
            </div>
          </div>

          <div className="empty-activity">
            <span className="empty-activity-icon">◷</span>
            <h3>No activity yet</h3>
            <p>System activities will appear here as administrators begin using the portal.</p>
          </div>
        </div>

        <div className="dashboard-panel quick-actions-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Access common management tasks</p>
            </div>
          </div>

          <div className="quick-actions-list">
            {quickActions.map((action) => (
              <Link to={action.path} className="quick-action" key={action.title}>
                <span className="quick-action-icon">{action.icon}</span>
                <span className="quick-action-text">
                  <strong>{action.title}</strong>
                  <small>{action.description}</small>
                </span>
                <span className="quick-action-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
