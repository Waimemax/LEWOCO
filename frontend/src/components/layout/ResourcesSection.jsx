import { useEffect, useState } from 'react'
import './ResourcesSection.css'

// Shown only if the server cannot be reached, so the public site is never blank
const fallbackResources = [
  {
    id: 1,
    category: 'Organizational Information',
    title: 'About LEWOCO',
    description:
      'Learn about Lower Eastern Women Cooperative Society Ltd, its mission and commitment to empowering women and youth in Lower Eastern Kenya.',
    icon: '🏢',
  },
  {
    id: 2,
    category: 'Women-Led Enterprise',
    title: 'Women Entrepreneurship',
    description:
      'Explore the importance of women-led enterprises, business development and economic independence in strengthening livelihoods.',
    icon: '📈',
  },
  {
    id: 3,
    category: 'Handmade Crafts',
    title: 'Woven Crafts & Creative Skills',
    description:
      'Discover handmade woven crafts, creative craftsmanship and opportunities for women to develop practical skills.',
    icon: '🧺',
  },
  {
    id: 4,
    category: 'Youth Development',
    title: 'Youth Beading & Skills Development',
    description:
      'Explore beading, creativity and practical skills that can encourage entrepreneurship and sustainable livelihoods among young people.',
    icon: '📿',
  },
  {
    id: 5,
    category: 'Sustainable Livelihoods',
    title: 'Building Sustainable Livelihoods',
    description:
      'Understand how skills development, enterprise opportunities and community participation can support lasting economic independence.',
    icon: '🌱',
  },
]

// Only ever link out to normal web addresses
const isWebLink = (value) => /^https?:\/\//i.test(value || '')

function ResourcesSection() {
  const [resources, setResources] = useState(fallbackResources)

  useEffect(() => {
    let cancelled = false

    fetch('/api/public/resources', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data.resources)) setResources(data.resources)
      })
      .catch(() => {
        // Keep the fallback list
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="resources-section" id="resources">
      <div className="resources-container">

        <div className="resources-heading">
          <span className="resources-label">KNOWLEDGE & INFORMATION</span>

          <h2>
            Explore Our <span>Resources</span>
          </h2>

          <p>
            Explore information and learning resources on women-led
            enterprises, handmade woven crafts, youth creative skills
            and sustainable livelihood opportunities.
          </p>
        </div>

        {resources.length === 0 && (
          <p style={{ textAlign: 'center', margin: '0 auto' }}>
            Resources will be shared here soon.
          </p>
        )}

        <div className="resources-grid">
          {resources.map((resource) => (
            <article className="resource-card" key={resource.id}>

              <div className="resource-icon">
                <span>{resource.icon || '•'}</span>
              </div>

              {resource.category && (
                <span className="resource-category">
                  {resource.category}
                </span>
              )}

              <h3>{resource.title}</h3>

              <p>{resource.description}</p>

              {isWebLink(resource.link_url) ? (
                <a
                  href={resource.link_url}
                  className="resource-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Resource <span>→</span>
                </a>
              ) : (
                <a href="#contact" className="resource-link">
                  Learn More <span>→</span>
                </a>
              )}

            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ResourcesSection
