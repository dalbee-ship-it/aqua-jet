'use client'
import { useState, useRef, useEffect } from 'react'

interface Props {
  projectId: string
  currentStatus: string
  onUpdate: () => void
}

const STATUS_OPTIONS = [
  { value: 'active', label: '활성', color: 'text-cyan-400' },
  { value: 'done', label: '완료 (포켓덱스 등록)', color: 'text-green-400' },
  { value: 'paused', label: '보류', color: 'text-yellow-400' },
  { value: 'archived', label: '보관', color: 'text-gray-400' },
  { value: 'abandoned', label: '폐기', color: 'text-red-400' },
]

export function ProjectMenu({ projectId, currentStatus, onUpdate }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function changeStatus(status: string) {
    setLoading(true)
    setOpen(false)
    await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    onUpdate()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="text-gray-600 hover:text-gray-300 transition-colors px-1"
        disabled={loading}
      >
        {loading ? '···' : '⋯'}
      </button>
      {open && (
        <div className="absolute right-0 top-6 z-10 bg-gray-900 border border-gray-700 rounded-lg py-1 w-44 shadow-xl">
          {STATUS_OPTIONS.filter(o => o.value !== currentStatus).map(opt => (
            <button
              key={opt.value}
              onClick={() => changeStatus(opt.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${opt.color}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
