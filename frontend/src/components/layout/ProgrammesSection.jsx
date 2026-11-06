import './ProgrammesSection.css'

function ProgrammesSection() {
  const programmes = [
    {
      number: '01',
      title: 'Women-Led Enterprise',
      description:
        'Supporting women to develop, manage and grow enterprises that promote economic independence and sustainable income opportunities.',
      icon: '📈',
    },
    {
      number: '02',
      title: 'Women & Youth Development',
      description:
        'Promoting skills development, capacity building and opportunities that enable women and young people to participate in community development.',
      icon: '🤝',
    },
    {
      number: '03',
      title: 'Handmade Woven Crafts',
      description:
        'Supporting women in developing their handmade weaving skills, preserving creative craftsmanship and creating livelihood opportunities.',
      icon: '🧺',
    },
    {
      number: '04',
      title: 'Youth Beading & Creative Skills',
      description:
        'Encouraging young people to develop practical beading and creative skills that can support entrepreneurship and self-reliance.',
      icon: '📿',
    },
    {
      number: '05',
      title: 'Sustainable Livelihoods',
      description:
        'Promoting sustainable economic opportunities that strengthen household incomes, improve living conditions and support community development.',
      icon: '🌱',
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
          LEWOCO focuses on empowering women and youth through
          enterprise development, creative skills, handmade crafts
          and sustainable livelihood opportunities across Lower
          Eastern Kenya.
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