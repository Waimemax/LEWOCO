
import { Routes, Route } from 'react-router-dom'

import PublicNavbar from './components/layout/PublicNavbar'
import HeroSection from './components/layout/HeroSection'
import AboutSection from './components/layout/AboutSection'
import ProgrammesSection from './components/layout/ProgrammesSection'
import ProjectsSection from './components/layout/ProjectsSection'
import NewsSection from './components/layout/NewsSection'
import ResourcesSection from './components/layout/ResourcesSection'
import ContactSection from './components/layout/ContactSection'
import Footer from './components/layout/Footer'

import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'

import './App.css'

function PublicHome() {
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
