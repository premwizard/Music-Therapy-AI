import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import AuthCard from '../components/AuthCard'
import { useAuth } from '../contexts/AuthContext'
import { loginUser } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const token = await loginUser({ username: email, password })
      login(token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-10 text-forest-950 animate-fade-in">
      <div className="relative flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <section className="w-full lg:w-[45%] space-y-6">
          <div className="border-2 border-mint bg-forest-950 px-4 py-2 text-sm uppercase tracking-[0.28em] text-mint-400 font-archivo">
            AI-powered therapy for every mood
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-bebas leading-tight text-forest-950">Sign in to continue your music therapy journey.</h1>
          <p className="w-full text-base leading-8 text-mint-100 font-archivo">
            Access your emotion insights, tailored playlists, and AI-guided reflections in one secure place.
          </p>
        </section>

        <AuthCard
          badge="Welcome back"
          title="Login to your account"
          subtitle="Secure access to your emotional soundscape and personalized music recommendations."
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} id="email" label="Email address" type="email" placeholder="you@example.com" />
            <Input value={password} onChange={(event) => setPassword(event.target.value)} id="password" label="Password" type="password" placeholder="Enter your password" />
            <div className="flex items-center justify-between gap-4 text-sm text-mint-100">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 border-2 border-mint bg-forest-950 text-mint-500 focus:ring-mint-400 focus:ring-2" />
                <span className="font-archivo">Remember me</span>
              </label>
              <button type="button" className="text-mint-400 transition duration-200 hover:text-mint-300 font-archivo">Forgot password?</button>
            </div>
            {error ? <div className="border-2 border-[#621111] bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <div className="text-center text-sm text-mint-100 font-archivo">
            Don't have an account? <Link to="/register" className="font-semibold text-mint-400 hover:text-mint-300">Create one</Link>
          </div>
        </AuthCard>
      </div>
    </main>
  )
}
