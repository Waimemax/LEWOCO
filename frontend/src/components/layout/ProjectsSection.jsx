
import './ProjectsSection.css'

function ProjectsSection() {
  const projects = [
    {
      number: '01',
      category: 'AGRICULTURE',
      title: 'Sustainable Community Agriculture',
      description:
        'Supporting women in adopting sustainable agricultural practices that strengthen food security, improve livelihoods and promote environmental responsibility.',
      icon: '🌾',
    },
    {
      number: '02',
      category: 'SKILLS DEVELOPMENT',
      title: 'Women Skills Development',
      description:
        'Creating opportunities for women to acquire practical vocational skills in handicrafts, food processing and other productive activities.',
      icon: '🧵',
    },
    {
      number: '03',
      category: 'ENTREPRENEURSHIP',
      title: 'Women-led Enterprise Development',
      description:
        'Encouraging entrepreneurship through business knowledge, capacity building and initiatives that support sustainable women-led enterprises.',
      icon: '🌱',
    },
  ]

  return (
    <section className="projects-section" id="projects">
      <div className="projects-heading">
        <span className="projects-label">OUR COMMUNITY IMPACT</span>

        <h2>
          Projects That <span>Inspire Change</span>
        </h2>

        <p>
          We focus on initiatives that create meaningful opportunities,
          strengthen women's participation and contribute to sustainable
          community development.
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
