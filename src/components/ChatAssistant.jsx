import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, MessageSquare } from 'lucide-react'
import { askAnalytics } from '../utils/aiContext.js'

const SUGGESTED = [
  'Top collection city',
  'Mumbai rejected properties',
  'Delhi approval %',
  'Pending approvals',
]

const SERVICE_UNAVAILABLE = 'Analytics service temporarily unavailable.'

export default function ChatAssistant({ chatContext }) {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Ask about approvals, collections, rejections, or city comparisons.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const summary = useMemo(() => JSON.stringify(chatContext, null, 2), [chatContext])
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const ask = async (q) => {
    const question = (q || input).trim()
    if (!question || loading) return

    setMsgs(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const answer = await askAnalytics(question, summary)
      setMsgs(prev => [...prev, { role: 'assistant', text: answer || SERVICE_UNAVAILABLE, err: answer === SERVICE_UNAVAILABLE }])
    } catch (error) {
      console.error(error)
      setMsgs(prev => [...prev, { role: 'assistant', text: SERVICE_UNAVAILABLE, err: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card flex flex-col" style={{ height: 480 }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <MessageSquare size={13} color="var(--muted)" />
          <span className="text-sm font-medium">Analytics Query</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
        {msgs.map((m, i) => (
          <div key={i} className={`msg flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p
              className="text-xs leading-relaxed px-3 py-2 rounded-lg max-w-xs"
              style={{
                background: m.role === 'user'
                  ? 'rgba(59,130,246,0.12)'
                  : m.err ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${m.role === 'user' ? 'rgba(59,130,246,0.25)' : m.err ? 'rgba(248,113,113,0.2)' : 'var(--border-hi)'}`,
                color: m.err ? '#f87171' : 'var(--text)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.text}
            </p>
          </div>
        ))}
        {loading && (
          <div className="msg flex justify-start">
            <div className="flex gap-1 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-hi)' }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="dot block rounded-full" style={{ width: 5, height: 5, background: 'var(--muted)', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {msgs.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded"
              style={{ background: 'rgba(148,163,184,0.07)', border: '1px solid var(--border-hi)', color: 'var(--muted)' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder="Type a question..."
            disabled={loading}
            className="flex-1 text-xs px-3 py-2 rounded-lg focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-hi)', color: 'var(--text)' }}
          />
          <button
            onClick={() => ask()}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg min-w-10"
            aria-label="Send question"
            style={{ background: !input.trim() || loading ? 'rgba(59,130,246,0.2)' : '#3b82f6', color: '#fff' }}
          >
            {loading ? <span className="mono text-xs">...</span> : <Send size={13} />}
          </button>
        </div>
      </div>
    </div>
  )
}
