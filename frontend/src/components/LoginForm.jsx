import React, {useState} from 'react'

export default function LoginForm({onLogin}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      const ctrl = new AbortController()
      const timeout = setTimeout(()=>ctrl.abort(), 10000)
      let res
      try{
        res = await fetch('/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password}), signal: ctrl.signal })
      }catch(e){
        if(e.name === 'AbortError') throw new Error('Request timed out (server took too long)')
        throw e
      }finally{ clearTimeout(timeout) }
      const body = await res.json().catch(()=>({error:'Invalid response'}))
      if(!res.ok){ throw new Error(body.error || 'Login failed') }
      onLogin && onLogin(body.token)
      setInfo('Login successful')
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <section className="auth">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username
          <input placeholder="your username" value={username} onChange={e=>setUsername(e.target.value)} />
        </label>
        <label>Password
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <button disabled={loading || !username || !password}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {info && <div className="message">{info}</div>}
    </section>
  )
}
