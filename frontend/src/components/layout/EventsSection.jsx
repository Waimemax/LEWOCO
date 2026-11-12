import { useEffect, useState } from 'react'
import './EventsSection.css'

const toDate = (value) => new Date(String(value).slice(0, 10))

const monthOf = (value) =>
  toDate(value).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })

const dayOf = (value) =>
  toDate(value).toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'UTC' })

const fullDate = (value) =>
  toDate(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

function whenText(event) {
  const start = fullDate(event.start_date)
  const end = event.end_date ? fullDate(event.end_date) : ''
  const dates = end && end !== start ? `${start} – ${end}` : start

  const from = event.start_time ? String(event.start_time).slice(0, 5) : ''
  const to = event.end_time ? String(event.end_time).slice(0, 5) : ''
  const times = from && to ? `${from} – ${to}` : from

  return times ? `${dates} · ${times}` : dates
}

// Shows only when there is at least one upcoming published event
function EventsSection() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    let cancelled = false

    fetch('/api/public/events', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data.events)) setEvents(data.events)
      })
      .catch(() => {
        // No events section if the server cannot be reached
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (events.length === 0) return null

  return (
    <section className="events-section" id="events">
      <div className="events-container">
        <div className="events-heading">
          <span className="events-label">TRAINING & EVENTS</span>

          <h2>
            Upcoming <span>Events</span>
          </h2>

          <p>
            Join LEWOCO's trainings, workshops and community events
            across Lower Eastern Kenya.
          </p>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <article className="event-card" key={event.id}>
              <div className="event-date" aria-hidden="true">
                <strong>{dayOf(event.start_date)}</strong>
                <span>{monthOf(event.start_date)}</span>
              </div>

              <div className="event-body">
                <span className="event-type">{event.type}</span>

                <h3>{event.title}</h3>

                {event.description && <p>{event.description}</p>}

                <ul className="event-details">
                  <li>{whenText(event)}</li>
                  {event.venue && <li>{event.venue}</li>}
                </ul>

                <a href="#contact" className="event-link">
                  Enquire about this event <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventsSection
