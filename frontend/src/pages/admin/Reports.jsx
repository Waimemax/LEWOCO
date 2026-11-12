import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { downloadFile } from '../../lib/download'
import './Members.css'
import './Reports.css'

function BarList({ items, empty = 'No data yet.' }) {
  const max = Math.max(1, ...items.map((item) => item.count))

  if (items.length === 0) return <p className="report-empty">{empty}</p>

  return (
    <ul className="bar-list">
      {items.map((item) => (
        <li key={item.label}>
          <span className="bar-label">{item.label}</span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${(item.count / max) * 100}%` }} />
          </span>
          <span className="bar-count">{item.count}</span>
        </li>
      ))}
    </ul>
  )
}

function MonthBars({ items }) {
  const max = Math.max(1, ...items.map((item) => item.count))

  return (
    <div className="month-bars" role="img" aria-label="Monthly totals for the last 12 months">
      {items.map((item) => (
        <div className="month-col" key={item.month} title={`${item.label}: ${item.count}`}>
          <span className="month-count">{item.count || ''}</span>
          <span className="month-bar" style={{ height: `${(item.count / max) * 100}%` }} />
          <span className="month-label">{item.label.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  )
}

function Figure({ label, value, note }) {
  return (
    <div className="figure">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  )
}

function Reports() {
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState('')

  useEffect(() => {
    let cancelled = false

    api('/reports')
      .then((data) => !cancelled && setReport(data))
      .catch((err) => !cancelled && setError(err.message))

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDownload(path, fileName) {
    setError('')
    setDownloading(path)

    try {
      await downloadFile(path, fileName)
    } catch (err) {
      setError(err.message)
    } finally {
      setDownloading('')
    }
  }

  const generated = report
    ? new Date(report.generated_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : ''

  const content = report?.content

  return (
    <div className="members-page">
      <div className="members-heading">
        <div>
          <span className="members-eyebrow">SYSTEM</span>
          <h1>Reports</h1>
          <p>
            Summaries of members, content and enquiries.
            {generated && ` Generated ${generated}.`}
          </p>
        </div>
      </div>

      {error && <div className="members-alert error" role="alert">{error}</div>}

      {!report && !error && <p className="report-empty">Loading reports…</p>}

      {report && (
        <>
          <section className="report-panel">
            <div className="report-heading">
              <div>
                <h2>Membership</h2>
                <p>Cooperative member records</p>
              </div>

              <button
                type="button"
                className="btn-secondary"
                disabled={downloading === '/reports/members.csv'}
                onClick={() => handleDownload('/reports/members.csv', 'lewoco-members.csv')}
              >
                {downloading === '/reports/members.csv' ? 'Preparing…' : 'Download members (CSV)'}
              </button>
            </div>

            <div className="figures">
              <Figure label="Total members" value={report.members.total} />
              <Figure label="Active" value={report.members.active} />
              <Figure label="Inactive" value={report.members.inactive} />
            </div>

            <div className="report-columns">
              <div>
                <h3>Members by county</h3>
                <BarList items={report.members.by_county} empty="No members registered yet." />
              </div>
              <div>
                <h3>Members by gender</h3>
                <BarList items={report.members.by_gender} empty="No members registered yet." />
              </div>
            </div>

            <h3>New members per month (last 12 months)</h3>
            <MonthBars items={report.members.joined_per_month} />
          </section>

          <section className="report-panel">
            <div className="report-heading">
              <div>
                <h2>Website content</h2>
                <p>What is published on the public website</p>
              </div>
            </div>

            <div className="members-table-wrap">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Published</th>
                    <th>Draft</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Programmes</td><td>{content.programmes.published}</td><td>{content.programmes.draft}</td></tr>
                  <tr><td>Projects</td><td>{content.projects.published}</td><td>{content.projects.draft}</td></tr>
                  <tr><td>News &amp; Announcements</td><td>{content.news.published}</td><td>{content.news.draft}</td></tr>
                  <tr><td>Resources</td><td>{content.resources.published}</td><td>{content.resources.draft}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="figures">
              <Figure label="Upcoming events" value={content.events.upcoming} note="Published, not yet finished" />
              <Figure label="Past events" value={content.events.past} />
              <Figure label="Events in draft" value={content.events.draft} />
            </div>
          </section>

          <section className="report-panel">
            <div className="report-heading">
              <div>
                <h2>Enquiries</h2>
                <p>Messages from the contact form</p>
              </div>

              <button
                type="button"
                className="btn-secondary"
                disabled={downloading === '/reports/enquiries.csv'}
                onClick={() => handleDownload('/reports/enquiries.csv', 'lewoco-enquiries.csv')}
              >
                {downloading === '/reports/enquiries.csv' ? 'Preparing…' : 'Download enquiries (CSV)'}
              </button>
            </div>

            <div className="figures">
              <Figure label="Total received" value={report.enquiries.total} />
              <Figure label="New" value={report.enquiries.new} />
              <Figure label="Read" value={report.enquiries.read} />
              <Figure label="Responded" value={report.enquiries.responded} />
            </div>

            <div className="report-columns">
              <div>
                <h3>Enquiries by subject</h3>
                <BarList items={report.enquiries.by_subject} empty="No enquiries yet." />
              </div>
              <div>
                <h3>Received per month (last 12 months)</h3>
                <MonthBars items={report.enquiries.received_per_month} />
              </div>
            </div>
          </section>

          <p className="report-note">
            Downloaded files contain personal information. Store them securely and share them only with authorised staff.
          </p>
        </>
      )}
    </div>
  )
}

export default Reports
