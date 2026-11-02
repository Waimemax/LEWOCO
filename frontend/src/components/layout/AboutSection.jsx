
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
          <p>Empowering women through collective action.</p>
        </div>
      </div>

      <div className="about-content">
        <span className="about-label">WHO WE ARE</span>

        <h2>
          About <span>LEWOCO</span>
        </h2>

        <p className="about-intro">
          Lower Eastern Women Cooperative Union (LEWOCO) is an
          organization committed to empowering women and strengthening
          communities across the Lower Eastern region.
        </p>

        <p className="about-description">
          Through financial empowerment initiatives, capacity building,
          sustainable agriculture, vocational training and advocacy,
          LEWOCO works to create opportunities that enable women to
          improve their livelihoods and actively participate in
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