import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-950 text-white">
        <div className="rounded-3xl border border-mint bg-forest-900/90 px-8 py-6 shadow-mint-glow text-center">
          <p className="text-lg font-semibold">Loading your session...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
