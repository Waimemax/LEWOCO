import { useEffect, useState } from 'react'
import './ProgrammesSection.css'

// Shown only if the server cannot be reached, so the public site is never blank
const fallbackProgrammes = [
  {
    id: 1,
    title: 'Women-Led Enterprise',
    description:
      'Supporting women to develop, manage and grow enterprises that promote economic independence and sustainable income opportunities.',
    icon: '📈',
  },
  {
    id: 2,
    title: 'Women & Youth Development',
    description:
      'Promoting skills development, capacity building and opportunities that enable women and young people to participate in community development.',
    icon: '🤝',
  },
  {
    id: 3,
    title: 'Handmade Woven Crafts',
    description:
      'Supporting women in developing their handmade weaving skills, preserving creative craftsmanship and creating livelihood opportunities.',
    icon: '🧺',
  },
  {
    id: 4,
    title: 'Youth Beading & Creative Skills',
    description:
      'Encouraging young people to develop practical beading and creative skills that can support entrepreneurship and self-reliance.',
    icon: '📿',
  },
  {
    id: 5,
    title: 'Sustainable Livelihoods',
    description:
      'Promoting sustainable economic opportunities that strengthen household incomes, improve living conditions and support community development.',
    icon: '🌱',
  },
]

function ProgrammesSection() {
  const [programmes, setProgrammes] = useState(fallbackProgrammes)

  useEffect(() => {
    let cancelled = false

    fetch('/api/public/programmes', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data.programmes)) setProgrammes(data.programmes)
      })
      .catch(() => {
        // Keep the fallback list
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="programmes-section" id="programmes">
      <div className="programmes-heading">
        <span className="programmes-label">WHAT WE DO</span>

        <h2>
          Our <span>Programmes</span>
        </h2>

        <p>
          LEWOCO focuses on empowering women and youth through
          enterprise development, creative skills, handmade crafts
          and sustainable livelihood opportunities across Lower
          Eastern Kenya.
        </p>
      </div>

      {programmes.length === 0 && (
        <p style={{ textAlign: 'center', margin: '0 auto' }}>
          Our programmes will be listed here soon.
        </p>
      )}

      <div className="programmes-grid">
        {programmes.map((programme, index) => (
          <article className="programme-card" key={programme.id}>
            <div className="programme-card-top">
              <span className="programme-icon">{programme.icon || '•'}</span>
              <span className="programme-number">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3>{programme.title}</h3>

            <p>{programme.description}</p>

            <a href="#contact" className="programme-link">
              Learn More <span>→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProgrammesSection
