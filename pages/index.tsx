import { useState } from 'react'

export default function HomePage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    setLoading(true)
    setAnswer('')
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      setAnswer(data.answer)
    } catch (e) {
      console.error(e)
      setAnswer('Error talking to chatbot.')
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Chapter 2 Q&A</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        style={{ width: '100%' }}
        placeholder="Ask about Chapter 2..."
      />
      <button onClick={ask} disabled={loading || !question.trim()}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      {answer && (
        <div style={{ marginTop: '1rem', background: '#eee', padding: '1rem' }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </main>
  )
}
