import { useMemo, useRef, useState, useEffect } from 'react'
import Input from './Input'
import Button from './Button'
import { detectTextEmotion, getTherapyResponse, saveMood } from '../services/api'

export default function ChatPanel() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const [chat, setChat] = useState([
    { role: 'assistant', text: 'Welcome back. Share how you feel, and I’ll suggest a playlist to support you.' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [detectedEmotion, setDetectedEmotion] = useState('neutral')

  const canSend = input.trim().length > 0
  const visibleMessages = useMemo(() => chat.slice(-6), [chat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleMessages])

  async function handleSend() {
    if (!canSend) return
    setError(null)
    setLoading(true)

    const messageText = input.trim()
    setChat((current) => [...current, { role: 'user', text: messageText }])
    setInput('')

    try {
      const emotionData = await detectTextEmotion(messageText)
      const emotion = emotionData?.emotion || 'neutral'
      setDetectedEmotion(emotion)

      const therapyData = await getTherapyResponse(emotion, messageText)
      const assistantText = therapyData?.response || 'I’m here with you. Tell me more about what you’re feeling.'
      setSuggestions(Array.isArray(therapyData?.suggestions) ? therapyData.suggestions : [])

      setChat((current) => [...current, { role: 'assistant', text: assistantText }])

      if (emotion) {
        await saveMood({ emotion, notes: messageText, source: 'chat' })
      }
    } catch (err) {
      setError(err.message)
      setChat((current) => [...current, { role: 'assistant', text: 'Something went wrong while processing your message. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="chat" className="border-2 border-mint bg-forest-950 p-6 text-cream animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-mint-400">Therapy chat</p>
          <h2 className="mt-2 text-2xl font-bold text-cream">Check in and receive a personalized playlist</h2>
        </div>
        <span className="border-2 border-mint px-4 py-2 text-xs uppercase tracking-[0.28em] text-mint-100">Live</span>
      </div>

      <div className="space-y-4 border-2 border-mint bg-forest-950 p-5">
        <div className="mb-4 flex items-center justify-between gap-4 border-2 border-mint bg-forest-950 px-4 py-3 text-sm text-mint-100">
          <span>Detected emotion: {detectedEmotion}</span>
          {loading ? <span>Analyzing...</span> : <span>Ready to listen</span>}
        </div>

        {visibleMessages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] border-2 border-mint px-4 py-4 text-sm leading-6 transition-all duration-300 ease-in-out animate-fade-in ${message.role === 'assistant' ? 'bg-forest-950 text-cream' : 'bg-forest-900 text-mint-100'}`}>
              <p className="font-medium uppercase tracking-[0.24em] text-[0.65rem] text-mint-400">
                {message.role === 'assistant' ? 'Assistant' : 'You'}
              </p>
              <p className="mt-2 text-sm leading-6 text-mint-100">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error ? (
        <div className="mt-4 border-2 border-[#621111] bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="mt-5 border-2 border-mint bg-forest-950 p-5 text-sm text-mint-100">
          <p className="mb-3 font-semibold text-cream">Suggestions</p>
          <ul className="list-disc space-y-2 pl-5">
            {suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="chat-input">Chat input</label>
        <Input
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="How are you feeling today?"
        />
        <Button type="button" onClick={handleSend} disabled={!canSend || loading} className="w-full sm:w-auto">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />
              Sending...
            </span>
          ) : 'Send'}
        </Button>
      </div>
    </section>
  )
}
