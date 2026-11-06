
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
            <small>Lower Eastern Women Cooperative Society Ltd</small>
          </div>

         <p>
  Lower Eastern Women Cooperative Society Ltd (LEWOCO)
  empowers women and youth through women-led enterprises,
  handmade woven crafts, youth beading and creative skills,
  and sustainable livelihood opportunities across Lower
  Eastern Kenya.
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
        <p>Empowering Women. Developing Youth. Building Sustainable Livelihoods.</p>
      </div>
    </footer>
  )
}

export default Footer
