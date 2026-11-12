import { useEffect, useState } from 'react'
import './NewsSection.css'

// Shown only if the server cannot be reached, so the public site is never blank
const fallbackAnnouncements = [
  {
    id: 1,
    category: 'Women-Led Enterprise',
    label: 'Focus Area',
    title: 'Creating Opportunities for Women Entrepreneurs',
    description:
      'Explore how women-led enterprises can strengthen economic independence, encourage entrepreneurship and create sustainable livelihood opportunities.',
    image_url:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    category: 'Handmade Woven Crafts',
    label: 'Focus Area',
    title: 'Celebrating Handmade Woven Crafts',
    description:
      'Discover the value of handmade woven crafts in promoting creativity, preserving craftsmanship and supporting women’s economic opportunities.',
    image_url:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    category: 'Youth Development',
    label: 'Focus Area',
    title: 'Developing Youth Through Beading and Creative Skills',
    description:
      'Learn how beading and creative skills can encourage young people to explore entrepreneurship, creativity and sustainable livelihoods.',
    image_url:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
  },
]

function displayDate(item) {
  if (!item.published_at) return item.label || 'Update'

  return new Date(String(item.published_at).slice(0, 10)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function NewsSection() {
  const [announcements, setAnnouncements] = useState(fallbackAnnouncements)

  useEffect(() => {
    let cancelled = false

    fetch('/api/public/announcements', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data.announcements)) setAnnouncements(data.announcements)
      })
      .catch(() => {
        // Keep the fallback list
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="news-section" id="news">
      <div className="news-container">

        <div className="news-heading">
          <span className="news-label">NEWS & ANNOUNCEMENTS</span>

          <h2>
            What's Happening at <span>LEWOCO</span>
          </h2>

          <p>
            Explore LEWOCO's focus areas, opportunities and initiatives
            supporting women and youth through enterprise development,
            creative skills and sustainable livelihoods across Lower
            Eastern Kenya.
          </p>
        </div>

        {announcements.length === 0 && (
          <p style={{ textAlign: 'center', margin: '0 auto' }}>
            News and announcements will be posted here soon.
          </p>
        )}

        <div className="news-grid">
          {announcements.map((announcement) => (
            <article className="news-card" key={announcement.id}>
              <div className="news-image">
                {announcement.image_url && (
                  <img
                    src={announcement.image_url}
                    alt={announcement.title}
                    loading="lazy"
                  />
                )}
              </div>

              <div className="news-content">
                <div className="news-meta">
                  {announcement.category && (
                    <span className="news-category">
                      {announcement.category}
                    </span>
                  )}
                  <span className="news-date">
                    {displayDate(announcement)}
                  </span>
                </div>

                <h3>{announcement.title}</h3>

                <p>{announcement.description}</p>

                <a href="#contact" className="news-link">
                  Contact LEWOCO <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default NewsSection
