
import './Footer.css'
import lewocoLogo from '../../assets/images/LEWOCOLOGO.jpeg'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-about">
          <div className="footer-brand">
            <img src={lewocoLogo} alt="LEWOCO Logo" />
            <h2>LEWOCO</h2>
          </div>

          <p>
            Lower Eastern Women Cooperative Union works to empower
            women through sustainable agriculture, vocational skills,
            entrepreneurship and community development.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#programmes">Our Programmes</a>
          <a href="#projects">Our Projects</a>
          <a href="#contact">Contact Us</a>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <a href="mailto:info@lewocomcultd.co.ke">
            info@lewocomcultd.co.ke
          </a>
          <a href="tel:+254722937900">+254 722 937900</a>
          <a href="tel:+254722494037">+254 722 494037</a>
          <p>Masii, Machakos County, Kenya</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} LEWOCO.
          All rights reserved.
        </p>
        <p>Empowering Women. Building Stronger Communities.</p>
      </div>
    </footer>
  )
}

export default Footer
