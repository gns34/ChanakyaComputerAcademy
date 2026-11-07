/* eslint-disable react-refresh/only-export-components */
// DataContext.jsx — manages questions, students, and results via D1 & localStorage
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const DataContext = createContext(null)

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_STUDENTS = [
  { id: 's1', name: 'Ravi Sharma', username: 'ravi', password: 'ravi123', createdAt: '2026-01-10' },
  { id: 's2', name: 'Priya Singh', username: 'priya', password: 'priya123', createdAt: '2026-01-12' },
  { id: 's3', name: 'Amit Kumar', username: 'amit', password: 'amit123', createdAt: '2026-01-15' },
]

const SEED_QUESTIONS = [
  {
    id: 'q1', subject: 'Computer Basics',
    text: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Central Program Unit', 'Computer Processing Unit', 'Control Processing Unit'],
    correctIndex: 0, createdAt: '2026-01-20',
  },
  {
    id: 'q2', subject: 'Computer Basics',
    text: 'Which of the following is an input device?',
    options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
    correctIndex: 2, createdAt: '2026-01-20',
  },
  {
    id: 'q3', subject: 'Computer Basics',
    text: 'What is the full form of RAM?',
    options: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Memory', 'Read And Memory'],
    correctIndex: 1, createdAt: '2026-01-21',
  },
  {
    id: 'q4', subject: 'MS Office',
    text: 'Which shortcut key is used to save a file in MS Word?',
    options: ['Ctrl + P', 'Ctrl + X', 'Ctrl + S', 'Ctrl + Z'],
    correctIndex: 2, createdAt: '2026-01-22',
  },
  {
    id: 'q5', subject: 'MS Office',
    text: 'What does the "B" button in MS Word toolbar stand for?',
    options: ['Blank', 'Bold', 'Border', 'Background'],
    correctIndex: 1, createdAt: '2026-01-22',
  },
  {
    id: 'q6', subject: 'Internet',
    text: 'What does WWW stand for?',
    options: ['World Wide Web', 'Wide World Web', 'World Web Wide', 'Web World Wide'],
    correctIndex: 0, createdAt: '2026-01-23',
  },
  {
    id: 'q7', subject: 'Internet',
    text: 'Which protocol is used for sending emails?',
    options: ['HTTP', 'FTP', 'SMTP', 'TCP'],
    correctIndex: 2, createdAt: '2026-01-23',
  },
  {
    id: 'q8', subject: 'Computer Basics',
    text: 'How many bits make one byte?',
    options: ['4', '8', '16', '32'],
    correctIndex: 1, createdAt: '2026-01-24',
  },
]

const SEED_RESULTS = []

function load(key, seed) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : seed
  } catch {
    return seed
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [students, setStudentsState]  = useState(() => load('cca_students', SEED_STUDENTS))
  const [questions, setQuestionsState] = useState(() => load('cca_questions', SEED_QUESTIONS))
  const [results, setResultsState]    = useState(() => load('cca_results', SEED_RESULTS))

  // Sync students from Cloudflare D1 on mount
  useEffect(() => {
    let mounted = true
    api.getStudents().then((res) => {
      if (mounted && res?.success && Array.isArray(res?.students) && res.students.length > 0) {
        setStudentsState((prev) => {
          // Merge remote D1 students with any local state preserving passwords if stored locally
          const remoteStudents = res.students.map((rs) => {
            const existing = prev.find((p) => p.id === rs.id || p.username === rs.username)
            return {
              id: rs.id,
              name: rs.name,
              username: rs.username,
              role: rs.role || 'student',
              createdAt: rs.created_at || existing?.createdAt || new Date().toISOString().split('T')[0],
              password: existing?.password || '',
            }
          })
          save('cca_students', remoteStudents)
          return remoteStudents
        })
      }
    }).catch(() => {
      // Keep local state on error
    })
    return () => {
      mounted = false
    }
  }, [])

  // ── Students ────────────────────────────────────────────────────────────────
  const setStudents = (fn) => {
    setStudentsState((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      save('cca_students', next)
      return next
    })
  }

  const addStudent = async (data) => {
    const tempId = uid()
    const student = { ...data, id: tempId, createdAt: new Date().toISOString().split('T')[0] }
    setStudents((prev) => [...prev, student])

    // Sync to Cloudflare D1 with salted password hashing
    try {
      const res = await api.createStudent(data)
      if (res?.success && res.student?.id) {
        setStudents((prev) =>
          prev.map((s) => (s.id === tempId ? { ...s, id: res.student.id } : s))
        )
        return { success: true, student: res.student }
      }
    } catch (err) {
      console.warn('[DataContext] Error adding student to D1:', err)
    }
    return { success: true, student }
  }

  const updateStudent = async (id, data) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))

    // Sync to Cloudflare D1
    try {
      await api.updateStudent(id, data)
    } catch (err) {
      console.warn('[DataContext] Error updating student in D1:', err)
    }
  }

  const deleteStudent = async (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))

    // Sync to Cloudflare D1
    try {
      await api.deleteStudent(id)
    } catch (err) {
      console.warn('[DataContext] Error deleting student from D1:', err)
    }
  }

  // ── Questions ───────────────────────────────────────────────────────────────
  const setQuestions = (fn) => {
    setQuestionsState((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      save('cca_questions', next)
      return next
    })
  }

  const addQuestion = (data) => {
    const question = { ...data, id: uid(), createdAt: new Date().toISOString().split('T')[0] }
    setQuestions((prev) => [...prev, question])
    return question
  }

  const updateQuestion = (id, data) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)))
  }

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  // ── Results ─────────────────────────────────────────────────────────────────
  const setResults = (fn) => {
    setResultsState((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      save('cca_results', next)
      return next
    })
  }

  const addResult = (data) => {
    const result = { ...data, id: uid(), submittedAt: new Date().toISOString() }
    setResults((prev) => [result, ...prev])
    return result
  }

  return (
    <DataContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        results,
        addResult,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
