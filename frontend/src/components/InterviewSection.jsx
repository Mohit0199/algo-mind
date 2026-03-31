import { useState } from 'react'

export default function InterviewSection({ questions }) {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => {
    setOpenIdx(openIdx === i ? null : i)
  }

  return (
    <div className="card">
      <p className="section-label">Interview Questions</p>
      <p className="text-muted text-sm mb-6">Click a question to reveal the answer — perfect for interview prep.</p>
      <div className="space-y-3">
        {questions.map((item, i) => (
          <div
            key={i}
            className="interview-card"
          >
            <button
              id={`interview-q-${i}`}
              onClick={() => toggle(i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors duration-200"
            >
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-accent/20 text-accent-light text-xs font-bold flex items-center justify-center flex-shrink-0">
                  Q{i + 1}
                </span>
                <span className="text-text font-medium">{item.q}</span>
              </span>
              <span
                className="text-muted transition-transform duration-300 flex-shrink-0"
                style={{ transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▾
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: openIdx === i ? '400px' : '0px' }}
            >
              <div className="px-5 pb-5 pt-1">
                <div
                  className="p-4 rounded-xl text-muted leading-relaxed text-sm"
                  style={{ background: 'rgba(99,102,241,0.08)', borderLeft: '3px solid #6366F1' }}
                >
                  <span className="text-accent-light font-semibold text-xs uppercase tracking-wider block mb-2">Answer</span>
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
