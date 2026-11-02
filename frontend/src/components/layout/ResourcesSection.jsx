
import './ResourcesSection.css'

const resources = [
  {
    category: 'Organizational Information',
    type: 'Information',
    title: 'About LEWOCO',
    description:
      'Learn about LEWOCO, its mission, vision and commitment to women empowerment and community development.',
    icon: '🏢',
  },
  {
    category: 'Agriculture',
    type: 'Learning Material',
    title: 'Sustainable Agriculture',
    description:
      'Explore learning materials and information about sustainable agricultural practices and community livelihoods.',
    icon: '🌱',
  },
  {
    category: 'Skills Development',
    type: 'Learning Material',
    title: 'Vocational Skills Development',
    description:
      'Discover educational information on vocational skills, entrepreneurship and capacity building.',
    icon: '📚',
  },
  {
    category: 'Women Empowerment',
    type: 'Information',
    title: 'Women Empowerment & Advocacy',
    description:
      'Access information on gender equality, advocacy and the empowerment of women in communities.',
    icon: '🤝',
  },
]

function ResourcesSection() {
  return (
    <section className="resources-section" id="resources">
      <div className="resources-container">

        <div className="resources-heading">
          <span className="resources-label">KNOWLEDGE & INFORMATION</span>

          <h2>
            Explore Our <span>Resources</span>
          </h2>

          <p>
            Access useful information, educational materials and
            resources supporting women empowerment and community development.
          </p>
        </div>

        <div className="resources-grid">
          {resources.map((resource, index) => (
            <article className="resource-card" key={index}>

              <div className="resource-icon">
                <span>{resource.icon}</span>
              </div>

              <span className="resource-category">
                {resource.category}
              </span>

              <h3>{resource.title}</h3>

              <p>{resource.description}</p>

              <a href="#contact" className="resource-link">
                Learn More <span>→</span>
              </a>

            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ResourcesSection
