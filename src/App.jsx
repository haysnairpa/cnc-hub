import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import Home from './pages/Home'
import CncDetailPage from './pages/CncDetailPage'
import { AuthProvider } from '@/components/contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cnc/:id" element={<CncDetailPage />} />
      </Routes>
    </AuthProvider>
  )
}