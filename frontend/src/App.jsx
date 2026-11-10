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

import AuthProvider from './context/AuthProvider'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Login from './pages/admin/Login'
import Members from './pages/admin/Members'
import ComingSoon from './pages/admin/ComingSoon'
import RoleRoute from './components/common/RoleRoute'

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
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicHome />} />

        <Route path="/admin/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            {/* Super administrator only */}
            <Route element={<RoleRoute roles={['super_admin']} />}>
              <Route path="members" element={<Members />} />
              <Route path="reports" element={<ComingSoon />} />
              <Route path="settings" element={<ComingSoon />} />
            </Route>

            {/* Modules not built yet */}
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
