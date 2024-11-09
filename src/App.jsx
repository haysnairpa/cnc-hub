import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import Home from './pages/Home'
import CncDetailPage from './pages/CncDetailPage'
import { AuthProvider } from '@/components/contexts/AuthContext'
import { PrivateRoute } from '@/components/auth/PrivateRoute'
import AdminDashboard from './pages/Admin'
import Profile from './pages/Profile'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cnc/:id" element={<CncDetailPage />} />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute allowedRoles={["user", "admin"]}>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </AuthProvider>
  )
}