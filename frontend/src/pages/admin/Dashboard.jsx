import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import './Dashboard.css'

// roles: who sees it. Omitted = every administrator.
const quickActions = [
  {
    title: 'Add a Member',
    description: 'Register a new cooperative member',
    path: '/admin/members',
    icon: '♙',
    roles: ['super_admin'],
  },
  {
    title: 'Create a Programme',
    description: 'Set up an organizational programme',
    path: '/admin/programmes',
    icon: '▤',
  },
  {
    title: 'Add a Project',
    description: 'Record a community project',
    path: '/admin/projects',
    icon: '◫',
  },
  {
    title: 'Publish an Update',
    description: 'Create news or an announcement',
    path: '/admin/news',
    icon: '▧',
  },
  {
    title: 'Review Enquiries',
    description: 'Read messages from the contact form',
    path: '/admin/enquiries',
    icon: '✉',
  },
]

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

function timeAgo(iso) {
  if (!iso) return ''

  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  const steps = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]

  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }

  return 'just now'
}

function buildCards(stats, isSuper) {
  if (!stats) return []

  const cards = []

  if (isSuper && stats.members) {
    cards.push({
      title: 'Registered Members',
      value: stats.members.total,
      note: `${stats.members.active} active`,
      badge: 'Total',
      icon: '♙',
    })
  }

  cards.push(
    {
      title: 'Active Programmes',
      value: stats.programmes.published,
      note: stats.programmes.draft ? plural(stats.programmes.draft, 'draft', 'drafts') : 'All published',
      badge: 'Published',
      icon: '▤',
    },
    {
      title: 'Ongoing Projects',
      value: stats.projects.published,
      note: stats.projects.draft ? plural(stats.projects.draft, 'draft', 'drafts') : 'All published',
      badge: 'Published',
      icon: '◫',
    },
    {
      title: 'Upcoming Events',
      value: stats.events.upcoming,
      note: stats.events.draft ? plural(stats.events.draft, 'draft', 'drafts') : 'None in draft',
      badge: 'Published',
      icon: '▣',
    },
    {
      title: 'New Enquiries',
      value: stats.enquiries.new,
      note: `${stats.enquiries.total} received in total`,
      badge: stats.enquiries.new > 0 ? 'Needs attention' : 'Up to date',
      icon: '✉',
    },
  )

  return cards
}

function Dashboard() {
  const { user } = useAuth()
  const isSuper = user?.role === 'super_admin'

  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/dashboard')
      .then((data) => {
        if (cancelled) return
        setStats(data.stats)
        setRecent(data.recent)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoaded(true))

    return () => {
      cancelled = true
    }
  }, [])

  const cards = buildCards(stats, isSuper)
  const actions = quickActions.filter((action) => !action.roles || action.roles.includes(user?.role))
  const firstName = user?.name?.split(' ')[0]

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>
            {firstName ? `Welcome, ${firstName}. ` : ''}
            This is the LEWOCO administration portal.
          </p>
        </div>

        <div className="dashboard-date">
          <span>ORGANIZATION</span>
          <strong>LEWOCO</strong>
        </div>
      </div>

      {error && <div className="dashboard-error" role="alert">{error}</div>}

      <section className="dashboard-stats">
        {!loaded &&
          [0, 1, 2, 3].map((index) => (
            <article className="dashboard-stat-card" key={index}>
              <div className="stat-card-top">
                <span className="stat-icon">…</span>
              </div>
              <h3>Loading</h3>
              <strong className="stat-value">—</strong>
            </article>
          ))}

        {loaded &&
          cards.map((card) => (
            <article className="dashboard-stat-card" key={card.title}>
              <div className="stat-card-top">
                <span className="stat-icon">{card.icon}</span>
                <span className="stat-status">{card.badge}</span>
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
              <p>Latest records added to the system</p>
            </div>
          </div>

          {loaded && recent.length === 0 ? (
            <div className="empty-activity">
              <span className="empty-activity-icon">◷</span>
              <h3>No activity yet</h3>
              <p>
                New members, enquiries and content will appear here as
                administrators begin using the portal.
              </p>
            </div>
          ) : (
            <ul className="activity-list">
              {recent.map((item, index) => (
                <li key={`${item.label}-${item.at}-${index}`}>
                  <Link to={item.link} className="activity-item">
                    <span className="activity-label">{item.label}</span>
                    <span className="activity-text">{item.text}</span>
                    <span className="activity-time">{timeAgo(item.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-panel quick-actions-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Access common management tasks</p>
            </div>
          </div>

          <div className="quick-actions-list">
            {actions.map((action) => (
              <Link
                to={action.path}
                className="quick-action"
                key={action.title}
              >
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
