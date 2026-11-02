
import PublicNavbar from './components/layout/PublicNavbar'
import HeroSection from './components/layout/HeroSection'
import AboutSection from './components/layout/AboutSection'
import ProgrammesSection from './components/layout/ProgrammesSection'
import ProjectsSection from './components/layout/ProjectsSection'
import NewsSection from './components/layout/NewsSection'
import ResourcesSection from './components/layout/ResourcesSection'
import ContactSection from './components/layout/ContactSection'
import Footer from './components/layout/Footer'
import './App.css'


function App() {
  return (
    <>
      <PublicNavbar />

      <main>
        <HeroSection />

        <AboutSection />

       <ProgrammesSection />

        <ProjectsSection />
        <NewsSection />
        <ResourcesSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}

export default App
