import React, {useState} from 'react'

export default function RegisterForm({onRegister}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    setMessage(null)
    try{
      if(!username || !password){ throw new Error('Please provide username and password') }
      if(password !== confirm){ throw new Error('Passwords do not match') }
      const ctrl = new AbortController()
      const timeout = setTimeout(()=>ctrl.abort(), 10000)
      let res
      try{
        res = await fetch('/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username, password, meta: { displayName }}), signal: ctrl.signal })
      }catch(e){
        if(e.name === 'AbortError') throw new Error('Request timed out (server took too long)')
        throw e
      }finally{ clearTimeout(timeout) }
      const body = await res.json().catch(()=>({error:'Invalid response'}))
      if(!res.ok){
        throw new Error(body.error || 'Registration failed')
      }
      setMessage('Registration successful — please login')
      onRegister && onRegister()
    }catch(err){
      setError(err.message)
    }finally{ setLoading(false) }
  }

  return (
    <section className="auth">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username
          <input placeholder="choose a username" value={username} onChange={e=>setUsername(e.target.value)} />
        </label>
        <label>Password
          <input placeholder="create a password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <label>Confirm Password
          <input placeholder="confirm password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        </label>
        <label>Display name (optional)
          <input placeholder="Your name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
        </label>
        <button disabled={loading || !username || !password || password !== confirm}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
    </section>
  )
}
