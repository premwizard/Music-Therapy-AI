import React, {useState} from 'react'

export default function MultimodalRecommend(){
  const [prompt, setPrompt] = useState('')
  const [numSongs, setNumSongs] = useState(5)
  const [language, setLanguage] = useState('english')
  const [imageFile, setImageFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [detectedMood, setDetectedMood] = useState(null)
  const [perModality, setPerModality] = useState({})

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    setResults([])
    setDetectedMood(null)
    setLoading(true)

    try{
      let res
  if(imageFile || audioFile){
        const fd = new FormData()
        fd.append('prompt', prompt)
        fd.append('num_songs', Number(numSongs))
  fd.append('language', language)
        if(imageFile) fd.append('image', imageFile)
        if(audioFile) fd.append('audio', audioFile)
        const ctrl = new AbortController()
        const timeout = setTimeout(()=>ctrl.abort(), 10000)
        try{
          res = await fetch('/recommend-multimodal', { method:'POST', body: fd, signal: ctrl.signal })
        }catch(e){
          if(e.name === 'AbortError') throw new Error('Request timed out (server took too long)')
          throw e
        }finally{ clearTimeout(timeout) }
      } else {
        const ctrl = new AbortController()
        const timeout = setTimeout(()=>ctrl.abort(), 10000)
        try{
          res = await fetch('/recommend', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt, num_songs: Number(numSongs), language }), signal: ctrl.signal })
        }catch(e){
          if(e.name === 'AbortError') throw new Error('Request timed out (server took too long)')
          throw e
        }finally{ clearTimeout(timeout) }
      }

      if(!res.ok){
        const body = await res.json().catch(()=>({error:'Unknown error'}))
        throw new Error(body.error || 'Server error')
      }

  const data = await res.json()
  setResults(data.recommendations || [])
  if(data.mood) setDetectedMood(data.mood)
  if(data.per_modality) setPerModality(data.per_modality)
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="recommend">
      <form onSubmit={handleSubmit} className="recommend-form">
        <label>
          Describe how you feel or the mood you want
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. calm piano for studying" rows={3} />
        </label>

        <div style={{display:'flex',gap:12}}>
          <label className="multimodal" style={{flex:1}}>
            Upload face image (optional)
            <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files && e.target.files[0])} />
          </label>
          <label className="multimodal" style={{flex:1}}>
            Upload voice audio (optional)
            <input type="file" accept="audio/*" onChange={e=>setAudioFile(e.target.files && e.target.files[0])} />
          </label>
        </div>

        <label>
          Number of songs
          <input type="number" value={numSongs} onChange={e=>setNumSongs(e.target.value)} min={1} max={20} />
        </label>

        <label>
          Language
          <select value={language} onChange={e=>setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="tamil">Tamil</option>
          </select>
        </label>

        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <button disabled={loading} style={{minWidth:160}}>{loading ? 'Finding songs...' : 'Get recommendations'}</button>
          <div style={{marginLeft:'auto'}}>
            {detectedMood && <span className="mood-pill">{detectedMood}</span>}
          </div>
        </div>
      </form>

      <div className="recommend-results">
        {error && <div className="error">{error}</div>}
        {perModality && Object.keys(perModality).length > 0 && (
          <div style={{marginBottom:12}}>
            <strong>Per-modality moods:</strong>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              {perModality.face && <div className="mood-pill">Face: {perModality.face}</div>}
              {perModality.audio && <div className="mood-pill">Audio: {perModality.audio}</div>}
              {perModality.text && <div className="mood-pill">Text: {perModality.text}</div>}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <ol>
            {results.map((r, i) => (
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
        )}
      </div>
    </section>
  )
}
