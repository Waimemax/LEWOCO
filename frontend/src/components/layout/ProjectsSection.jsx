import { useEffect, useState } from 'react'
import './ProjectsSection.css'

// Shown only if the server cannot be reached, so the public site is never blank
const fallbackProjects = [
  {
    id: 1,
    category: 'Women-Led Enterprise',
    title: 'Women Enterprise Development',
    description:
      'Supporting women in building and growing sustainable enterprises through practical skills, entrepreneurship and opportunities for economic independence.',
    icon: '📈',
  },
  {
    id: 2,
    category: 'Handmade Crafts',
    title: 'Women in Woven Crafts',
    description:
      'Promoting handmade woven crafts by women through creative skills development, craftsmanship and opportunities to generate sustainable income.',
    icon: '🧺',
  },
  {
    id: 3,
    category: 'Youth Development',
    title: 'Youth Beading & Creative Skills',
    description:
      'Encouraging young people to develop beading and other creative skills that can support self-reliance, entrepreneurship and sustainable livelihoods.',
    icon: '📿',
  },
]

function ProjectsSection() {
  const [projects, setProjects] = useState(fallbackProjects)

  useEffect(() => {
    let cancelled = false

    fetch('/api/public/projects', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data.projects)) setProjects(data.projects)
      })
      .catch(() => {
        // Keep the fallback list
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="projects-section" id="projects">
      <div className="projects-heading">
        <span className="projects-label">OUR FOCUS AREAS</span>

        <h2>
          Creating Opportunities for <span>Lasting Change</span>
        </h2>

        <p>
          LEWOCO promotes initiatives that strengthen women-led
          enterprises, support creative skills development and
          create sustainable livelihood opportunities for women
          and youth across Lower Eastern Kenya.
        </p>
      </div>

      {projects.length === 0 && (
        <p style={{ textAlign: 'center', margin: '0 auto' }}>
          Our projects will be listed here soon.
        </p>
      )}

      <div className="projects-grid">
        {projects.map((project, index) => (
          <article className="project-card" key={project.id}>
            <div className="project-visual">
              <span className="project-icon">{project.icon || '•'}</span>
              <span className="project-number">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="project-content">
              {project.category && (
                <span className="project-category">
                  {project.category.toUpperCase()}
                </span>
              )}

              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <a href="#contact" className="project-link">
                Learn More <span>→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
