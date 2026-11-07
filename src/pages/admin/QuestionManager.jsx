// QuestionManager.jsx — CRUD for MCQ questions
import { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import { HelpCircle, Plus, Pencil, Trash2, Check } from 'lucide-react'

const SUBJECTS = ['Computer Basics', 'MS Office', 'Internet', 'Python', 'Hardware', 'Other']
const LABELS = ['A', 'B', 'C', 'D']

const EMPTY_FORM = {
  text: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  subject: 'Computer Basics',
}

function QuestionForm({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Question Text"
        placeholder="Enter the question..."
        value={value.text}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
      />
      <Select
        label="Subject"
        value={value.subject}
        onChange={(e) => onChange({ ...value, subject: e.target.value })}
      >
        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
      </Select>

      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-[#b3b3b3] block mb-2">
          Options (select the correct answer)
        </label>
        <div className="flex flex-col gap-2">
          {value.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...value, correctIndex: idx })}
                className={[
                  'w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center',
                  'transition-all duration-200 border text-xs font-bold active:scale-95 cursor-pointer',
                  value.correctIndex === idx
                    ? 'bg-[#1ed760] border-[#1ed760] text-black scale-105 shadow-[0_0_10px_rgba(30,215,96,0.4)]'
                    : 'bg-[#1f1f1f] border-[#4d4d4d] text-[#b3b3b3] hover:border-[#7c7c7c] hover:scale-105',
                ].join(' ')}
              >
                {value.correctIndex === idx ? <Check size={12} /> : LABELS[idx]}
              </button>
              <input
                type="text"
                placeholder={`Option ${LABELS[idx]}`}
                value={opt}
                onChange={(e) => {
                  const opts = [...value.options]
                  opts[idx] = e.target.value
                  onChange({ ...value, options: opts })
                }}
                className={[
                  'flex-1 bg-[#1f1f1f] text-white placeholder-[#7c7c7c]',
                  'px-3 py-2 text-sm rounded-[6px] border border-transparent',
                  'focus:outline-none focus:border-white transition-all',
                  value.correctIndex === idx ? 'border-[#1ed760]/50' : '',
                ].join(' ')}
                style={{ boxShadow: 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset' }}
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#7c7c7c] mt-1.5">Click the circle to mark correct answer</p>
      </div>
    </div>
  )
}

function validateForm(form) {
  if (!form.text.trim()) return 'Question text is required.'
  if (form.options.some((o) => !o.trim())) return 'All 4 options must be filled in.'
  return null
}

export function QuestionManager() {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useData()

  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')

  const openAdd = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (q) => {
    setEditId(q.id)
    setForm({ text: q.text, options: [...q.options], correctIndex: q.correctIndex, subject: q.subject })
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = () => {
    const err = validateForm(form)
    if (err) { setFormError(err); return }
    if (editId) {
      updateQuestion(editId, form)
    } else {
      addQuestion(form)
    }
    setModalOpen(false)
  }

  const filtered = questions.filter((q) => {
    const matchSearch = !search || q.text.toLowerCase().includes(search.toLowerCase())
    const matchSubject = filterSubject === 'All' || q.subject === filterSubject
    return matchSearch && matchSubject
  })

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Questions</h1>
          <p className="text-sm text-[#b3b3b3] mt-1">{questions.length} questions in the bank</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus size={15} /> Add Question
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#1f1f1f] text-white placeholder-[#7c7c7c] px-4 py-2.5 text-sm rounded-[500px] border border-transparent focus:outline-none focus:border-white transition-all"
          style={{ boxShadow: 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset' }}
        />
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="bg-[#1f1f1f] text-white px-4 py-2.5 text-sm rounded-[6px] border border-transparent focus:outline-none focus:border-white cursor-pointer"
          style={{ boxShadow: 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset' }}
        >
          <option value="All">All Subjects</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Questions list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No questions found"
          description="Add your first MCQ question using the button above."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((q, i) => (
            <Card key={q.id} hover className="transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-bold text-[#4d4d4d] uppercase">{i + 1}.</span>
                    <Badge variant="info">{q.subject}</Badge>
                  </div>
                  <p className="text-sm font-bold text-white mb-3">{q.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={[
                          'flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-xs transition-colors duration-150',
                          idx === q.correctIndex
                            ? 'bg-[#1ed760]/10 text-[#1ed760] border border-[#1ed760]/30'
                            : 'bg-[#1f1f1f] text-[#b3b3b3]',
                        ].join(' ')}
                      >
                        <span className={[
                          'w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0',
                          idx === q.correctIndex ? 'bg-[#1ed760] text-black' : 'bg-[#252525] text-[#7c7c7c]',
                        ].join(' ')}>
                          {idx === q.correctIndex ? <Check size={9} /> : LABELS[idx]}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(q)}
                    className="w-8 h-8 rounded-full bg-[#1f1f1f] hover:bg-[#252525] flex items-center justify-center text-[#b3b3b3] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Edit question"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(q.id)}
                    className="w-8 h-8 rounded-full bg-[#1f1f1f] hover:bg-[#f3727f]/20 flex items-center justify-center text-[#b3b3b3] hover:text-[#f3727f] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Delete question"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Question' : 'Add New Question'}
      >
        <QuestionForm value={form} onChange={setForm} />
        {formError && (
          <p className="text-xs text-[#f3727f] mt-3">{formError}</p>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editId ? 'Save Changes' : 'Add Question'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Question">
        <p className="text-sm text-[#b3b3b3] mb-6">
          Are you sure you want to delete this question? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => { deleteQuestion(deleteConfirm); setDeleteConfirm(null) }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  )
}
