
import './NewsSection.css'

const announcements = [
  {
    category: 'Community Development',
    date: 'Featured Update',
    title: 'Empowering Women Through Community Development',
    description:
      'Discover how community initiatives, skills development and collective action can create meaningful opportunities for women.',
    image: 'https://images.unsplash.com/photo-1594708767771-a750f9d7c9a1?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Sustainable Agriculture',
    date: 'Programme Update',
    title: 'Promoting Sustainable Agricultural Practices',
    description:
      'Learn about the importance of sustainable agriculture in supporting livelihoods, strengthening communities and improving resilience.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Women Empowerment',
    date: 'Organizational Update',
    title: 'Building Skills and Opportunities for Women',
    description:
      'Vocational training, entrepreneurship and capacity building can help women develop skills and pursue sustainable opportunities.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  },
]

function NewsSection() {
  return (
    <section className="news-section" id="news">
      <div className="news-container">

        <div className="news-heading">
          <span className="news-label">NEWS & ANNOUNCEMENTS</span>

          <h2>
            What's Happening at <span>LEWOCO</span>
          </h2>

          <p>
            Stay informed about our programmes, community activities
            and initiatives supporting women and community development.
          </p>
        </div>

        <div className="news-grid">
          {announcements.map((announcement, index) => (
            <article className="news-card" key={index}>
              <div className="news-image">
                <img
                  src={announcement.image}
                  alt={announcement.category}
                />
              </div>

              <div className="news-content">
                <div className="news-meta">
                  <span className="news-category">
                    {announcement.category}
                  </span>
                  <span className="news-date">
                    {announcement.date}
                  </span>
                </div>

                <h3>{announcement.title}</h3>

                <p>{announcement.description}</p>

                <a href="#contact" className="news-link">
                  Get in Touch <span>→</span>
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
