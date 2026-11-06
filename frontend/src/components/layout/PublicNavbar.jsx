
import './PublicNavbar.css'
import lewocoLogo from '../../assets/images/LEWOCOLOGO.jpeg'

function PublicNavbar() {
  return (
    <header className="public-navbar">
      <a href="#home" className="brand">
        <img
          src={lewocoLogo}
          alt="LEWOCO Logo"
          className="brand-logo"
        />

        <span className="brand-name">
          LEWOCO
          <small>Lower Eastern Women Cooperative Society Ltd</small>
        </span>
      </a>

      <nav className="public-nav">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#programmes">Programmes</a>
        <a href="#projects">Our Projects</a>
        <a href="#news">News</a>
        <a href="#resources">Resources</a>
        <a href="#contact">Contact</a>
      </nav>

      <a href="#contact" className="nav-button">
        Get Involved
      </a>
    </header>
  )
}

export default PublicNavbar
