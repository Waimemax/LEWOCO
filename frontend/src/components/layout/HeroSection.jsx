
import heroImage from '../../assets/images/hero-community.jpg'
import './HeroSection.css'

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <span className="hero-label">
          LOWER EASTERN WOMEN COOPERATIVE UNION
        </span>

        <h1>
          Empowering Women.
Developing Youth.
Building Sustainable Livelihoods.
          <span> LEWOCO empowers women and youth in Lower Eastern Kenya through women-led enterprises, handmade woven crafts, youth beading skills, and sustainable livelihood opportunities.</span>
        </h1>

        <p>
          We bring women together through sustainable development,
          skills training, agriculture, and community initiatives
          that create lasting opportunities.
        </p>

        <div className="hero-buttons">
          <a href="#programmes" className="hero-btn-primary">
            Explore Our Programmes
          </a>

          <a href="#contact" className="hero-btn-secondary">
            Get Involved
          </a>

           <a href="#contact" className="btn btn-secondary">
        Contact LEWOCO
          </a>
        </div>

        <div className="hero-highlights">
          <div className="hero-highlight">
            <span>01</span>
            <p>Women's Empowerment</p>
          </div>

          <div className="hero-highlight">
            <span>02</span>
            <p>Sustainable Agriculture</p>
          </div>

          <div className="hero-highlight">
            <span>03</span>
            <p>Skills & Capacity Building</p>
          </div>
        </div>
      </div>

      <div className="hero-image-wrapper">
        <img
          src={heroImage}
          alt="Women working together in their community"
          className="hero-image"
        />

        <div className="hero-image-caption">
          <span>Growing Together</span>
          <p>Creating opportunities for women and communities.</p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
