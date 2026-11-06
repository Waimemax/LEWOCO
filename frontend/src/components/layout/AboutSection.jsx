
import aboutImage from '../../assets/images/hero-community.jpg'
import './AboutSection.css'

function AboutSection() {
  return (
    <section className="about-section" id="about">

      <div className="about-image-wrapper">
        <img
          src={aboutImage}
          alt="Women working together towards community development"
          className="about-image"
        />

        <div className="about-image-note">
          <span>Stronger Together</span>
          <p>Empowering women and youth through sustainable livelihoods.</p>
        </div>
      </div>

      <div className="about-content">
        <span className="about-label">WHO WE ARE</span>

        <h2>
          About <span>LEWOCO</span>
        </h2>

                <p className="about-intro">
          Lower Eastern Women Cooperative Society Ltd (LEWOCO) is
          committed to empowering women and youth across Lower Eastern
          Kenya through enterprise development, skills development,
          and sustainable livelihood opportunities.
        </p>

        <p className="about-description">
          LEWOCO supports women-led enterprises, promotes handmade
          woven crafts by women, encourages youth participation in
          beading and creative skills, and strengthens sustainable
          livelihoods that promote economic independence and
          community development.
        </p>

        <div className="about-values">

          <div className="about-value">
            <span className="about-value-icon">01</span>
            <div>
              <h3>Empowerment</h3>
              <p>Supporting women to build confidence and independence.</p>
            </div>
          </div>

          <div className="about-value">
            <span className="about-value-icon">02</span>
            <div>
              <h3>Opportunity</h3>
              <p>Creating access to skills, knowledge and opportunities.</p>
            </div>
          </div>

          <div className="about-value">
            <span className="about-value-icon">03</span>
            <div>
              <h3>Community</h3>
              <p>Building stronger communities through collective action.</p>
            </div>
          </div>

        </div>

        <a href="#programmes" className="about-button">
          Discover Our Work
          <span>→</span>
        </a>

      </div>

    </section>
  )
}

export default AboutSection