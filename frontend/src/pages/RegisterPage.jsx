import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import AuthCard from '../components/AuthCard'
import { useAuth } from '../contexts/AuthContext'
import { registerUser } from '../services/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const token = await registerUser({ username: email, password, meta: { displayName: name } })
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
            Start your personalized journey
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-bebas leading-tight text-forest-950">Create your account and feel the power of music therapy.</h1>
          <p className="w-full text-base leading-8 text-mint-100 font-archivo">
            Unlock emotion-aware playlists, wellbeing insights, and guided AI support designed for your mental rhythm.
          </p>
        </section>

        <AuthCard
          badge="Get started"
          title="Create a new account"
          subtitle="Register to save your mood history, playlist preferences, and live session progress."
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input value={name} onChange={(event) => setName(event.target.value)} id="name" label="Full name" type="text" placeholder="Your name" />
            <Input value={email} onChange={(event) => setEmail(event.target.value)} id="email" label="Email address" type="email" placeholder="you@example.com" />
            <Input value={password} onChange={(event) => setPassword(event.target.value)} id="password" label="Password" type="password" placeholder="Create a password" />
            {error ? <div className="border-2 border-[#621111] bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <div className="text-center text-sm text-mint-100 font-archivo">
            Already registered? <Link to="/login" className="font-semibold text-mint-400 hover:text-mint-300">Sign in</Link>
          </div>
        </AuthCard>
      </div>
    </main>
  )
}
