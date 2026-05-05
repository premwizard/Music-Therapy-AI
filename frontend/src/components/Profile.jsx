import React, {useEffect, useState} from 'react'

export default function Profile({user, onUpdate}){
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(()=>{
    if(!user) return
    setLoading(true)
    fetch(`/profile?token=${encodeURIComponent(user)}`)
      .then(r=>r.json())
      .then(j=>{ if(!j.error) setMeta(j.meta || {}) })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }, [user])

  async function save(){
    setLoading(true); setMessage(null)
    try{
      const res = await fetch('/profile', {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': user}, body: JSON.stringify({meta})})
      const j = await res.json()
      if(!res.ok) throw new Error(j.error || 'Save failed')
      setMessage('Profile saved')
      onUpdate && onUpdate(j.meta)
      // persist locally
      try{ localStorage.setItem('mr_meta', JSON.stringify(j.meta || {})) }catch(e){}
    }catch(err){ setMessage(err.message) }
    finally{ setLoading(false) }
  }

  if(!user) return (<section className="card">Please login to edit your profile.</section>)

  return (
    <section className="card profile-card">
      <h2>Profile</h2>
      <div style={{display:'flex',gap:16}}>
        <div style={{width:120}}>
          <div style={{width:120,height:120,borderRadius:12,overflow:'hidden',background:'#eee'}}>
            {meta.avatar ? <img src={meta.avatar} style={{width:'100%',height:'100%',objectFit:'cover'}} alt="avatar" /> : <div style={{padding:12}}>No avatar</div>}
          </div>
        </div>
        <div style={{flex:1}}>
          <label>Display name
            <input value={meta.displayName || ''} onChange={e=>setMeta({...meta, displayName: e.target.value})} />
          </label>
          <label>Avatar URL
            <input value={meta.avatar || ''} onChange={e=>setMeta({...meta, avatar: e.target.value})} />
          </label>
          <label>Bio
            <textarea value={meta.bio || ''} onChange={e=>setMeta({...meta, bio: e.target.value})} rows={3} />
          </label>
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
            <button className="primary" onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            {message && <div style={{marginLeft:8}}>{message}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
