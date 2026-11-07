// DataContext.jsx — manages questions, students, and results via localStorage
import { createContext, useContext, useState, useEffect } from 'react'

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

  // ── Students ────────────────────────────────────────────────────────────────
  const setStudents = (fn) => {
    setStudentsState((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      save('cca_students', next)
      return next
    })
  }

  const addStudent = (data) => {
    const student = { ...data, id: uid(), createdAt: new Date().toISOString().split('T')[0] }
    setStudents((prev) => [...prev, student])
    return student
  }

  const updateStudent = (id, data) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
  }

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
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
    const result = { ...data, id: uid(), date: new Date().toISOString() }
    setResults((prev) => [...prev, result])
    return result
  }

  const getStudentResults = (studentId) =>
    results.filter((r) => r.studentId === studentId)

  return (
    <DataContext.Provider
      value={{
        students, addStudent, updateStudent, deleteStudent,
        questions, addQuestion, updateQuestion, deleteQuestion,
        results, addResult, getStudentResults,
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
