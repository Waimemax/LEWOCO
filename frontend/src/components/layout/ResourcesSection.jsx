
import './ResourcesSection.css'

const resources = [
  {
    category: 'Organizational Information',
    type: 'Information',
    title: 'About LEWOCO',
    description:
      'Learn about Lower Eastern Women Cooperative Society Ltd, its mission and commitment to empowering women and youth in Lower Eastern Kenya.',
    icon: '🏢',
  },
  {
    category: 'Women-Led Enterprise',
    type: 'Information',
    title: 'Women Entrepreneurship',
    description:
      'Explore the importance of women-led enterprises, business development and economic independence in strengthening livelihoods.',
    icon: '📈',
  },
  {
    category: 'Handmade Crafts',
    type: 'Learning Resource',
    title: 'Woven Crafts & Creative Skills',
    description:
      'Discover handmade woven crafts, creative craftsmanship and opportunities for women to develop practical skills.',
    icon: '🧺',
  },
  {
    category: 'Youth Development',
    type: 'Learning Resource',
    title: 'Youth Beading & Skills Development',
    description:
      'Explore beading, creativity and practical skills that can encourage entrepreneurship and sustainable livelihoods among young people.',
    icon: '📿',
  },
  {
    category: 'Sustainable Livelihoods',
    type: 'Information',
    title: 'Building Sustainable Livelihoods',
    description:
      'Understand how skills development, enterprise opportunities and community participation can support lasting economic independence.',
    icon: '🌱',
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
  Explore information and learning resources on women-led
  enterprises, handmade woven crafts, youth creative skills
  and sustainable livelihood opportunities.
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
