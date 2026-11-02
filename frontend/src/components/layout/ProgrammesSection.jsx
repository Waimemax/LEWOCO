
import './ProgrammesSection.css'

function ProgrammesSection() {
  const programmes = [
    {
      number: '01',
      title: 'Sustainable Agriculture',
      description:
        'Promoting sustainable farming practices, food security and agricultural activities that improve livelihoods and strengthen community resilience.',
      icon: '🌱',
    },
    {
      number: '02',
      title: 'Vocational Skills Training',
      description:
        'Equipping women with practical skills in areas such as handicrafts, food processing and other activities that support self-reliance.',
      icon: '🧵',
    },
    {
      number: '03',
      title: 'Entrepreneurship & Capacity Building',
      description:
        'Building business knowledge, leadership abilities and practical skills that help women develop and manage sustainable enterprises.',
      icon: '📈',
    },
    {
      number: '04',
      title: 'Gender Equality & Advocacy',
      description:
        'Promoting equal opportunities, social justice and meaningful participation of women in community and decision-making processes.',
      icon: '🤝',
    },
  ]

  return (
    <section className="programmes-section" id="programmes">
      <div className="programmes-heading">
        <span className="programmes-label">WHAT WE DO</span>

        <h2>
          Our <span>Programmes</span>
        </h2>

        <p>
          We implement programmes that empower women, strengthen
          livelihoods and create sustainable opportunities for
          communities across the Lower Eastern region.
        </p>
      </div>

      <div className="programmes-grid">
        {programmes.map((programme) => (
          <article className="programme-card" key={programme.number}>
            <div className="programme-card-top">
              <span className="programme-icon">{programme.icon}</span>
              <span className="programme-number">{programme.number}</span>
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
