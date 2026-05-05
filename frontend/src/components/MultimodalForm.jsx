import React, {useState} from 'react'

export default function MultimodalForm(){
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [audio, setAudio] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState('english')

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true); setError(null); setResult(null)
    try{
      const form = new FormData()
  if(text) form.append('text', text)
  form.append('language', language)
      if(image) form.append('image', image)
      if(audio) form.append('audio', audio)

      const ctrl = new AbortController()
      const timeout = setTimeout(()=>ctrl.abort(), 10000)
      const res = await fetch('/multimodal', { method: 'POST', body: form, signal: ctrl.signal }).finally(()=>clearTimeout(timeout))
      const body = await res.json().catch(()=>({error:'Invalid response'}))
      if(!res.ok) throw new Error(body.error || 'Request failed')
      setResult(body)
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <section className="multimodal">
      <h2>Multimodal Input</h2>
      <form onSubmit={handleSubmit}>
        <label>Text input
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={3} />
        </label>
          <label>
            Language
            <select value={language} onChange={e=>setLanguage(e.target.value)}>
              <option value="english">English</option>
              <option value="tamil">Tamil</option>
            </select>
          </label>
        <label>Image file
          <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} />
        </label>
        <label>Audio file (wav)
          <input type="file" accept="audio/*" onChange={e=>setAudio(e.target.files[0])} />
        </label>
        <button disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
      </form>

      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <h3>Detected mood: {result.mood}</h3>
          <h4>Recommendations</h4>
          <ol>
            {(result.recommendations || []).map((r,i)=> (
              <li key={i}>
                <div style={{display:'flex',flexDirection:'column'}}>
                  <div style={{fontWeight:600}}>{r.title || r}</div>
                  {r.artist && <div style={{fontSize:12}}>{r.artist}</div>}
                  {r.album && <div style={{fontSize:12,color:'#aaa'}}>{r.album}</div>}
                  <div style={{marginTop:6, display:'flex', gap:8}}>
                    {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="btn">Open ({r.source || 'link'})</a>}
                    <a href={r.url && r.source === 'spotify' ? r.url : `https://open.spotify.com/search/${encodeURIComponent((r.title||'') + (r.artist?(' '+r.artist):''))}`} target="_blank" rel="noreferrer" className="btn spotify">Spotify</a>
                    <a href={r.url && r.source === 'youtube' ? r.url : `https://www.youtube.com/results?search_query=${encodeURIComponent((r.title||'') + (r.artist?(' '+r.artist):''))}`} target="_blank" rel="noreferrer" className="btn youtube">YouTube</a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
