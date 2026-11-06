import './ProjectsSection.css'

function ProjectsSection() {
  const projects = [
    {
      number: '01',
      category: 'WOMEN-LED ENTERPRISE',
      title: 'Women Enterprise Development',
      description:
        'Supporting women in building and growing sustainable enterprises through practical skills, entrepreneurship and opportunities for economic independence.',
      icon: '📈',
    },
    {
      number: '02',
      category: 'HANDMADE CRAFTS',
      title: 'Women in Woven Crafts',
      description:
        'Promoting handmade woven crafts by women through creative skills development, craftsmanship and opportunities to generate sustainable income.',
      icon: '🧺',
    },
    {
      number: '03',
      category: 'YOUTH DEVELOPMENT',
      title: 'Youth Beading & Creative Skills',
      description:
        'Encouraging young people to develop beading and other creative skills that can support self-reliance, entrepreneurship and sustainable livelihoods.',
      icon: '📿',
    },
  ]

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

      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.number}>
            <div className="project-visual">
              <span className="project-icon">{project.icon}</span>
              <span className="project-number">{project.number}</span>
            </div>

            <div className="project-content">
              <span className="project-category">
                {project.category}
              </span>

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