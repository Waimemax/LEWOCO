
import './NewsSection.css'

const announcements = [
  {
    category: 'Women-Led Enterprise',
    date: 'Focus Area',
    title: 'Creating Opportunities for Women Entrepreneurs',
    description:
      'Explore how women-led enterprises can strengthen economic independence, encourage entrepreneurship and create sustainable livelihood opportunities.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Handmade Woven Crafts',
    date: 'Focus Area',
    title: 'Celebrating Handmade Woven Crafts',
    description:
      'Discover the value of handmade woven crafts in promoting creativity, preserving craftsmanship and supporting women’s economic opportunities.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Youth Development',
    date: 'Focus Area',
    title: 'Developing Youth Through Beading and Creative Skills',
    description:
      'Learn how beading and creative skills can encourage young people to explore entrepreneurship, creativity and sustainable livelihoods.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
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
  Explore LEWOCO's focus areas, opportunities and initiatives
  supporting women and youth through enterprise development,
  creative skills and sustainable livelihoods across Lower
  Eastern Kenya.
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
                  Contact LEWOCO <span>→</span>
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
