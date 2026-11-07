// StudentManager.jsx — CRUD for student accounts
import { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Users, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

const EMPTY_FORM = { name: '', username: '', password: '' }

function StudentForm({ value, onChange, isEdit }) {
  const [showPass, setShowPass] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="e.g. Ravi Sharma"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <Input
        label="Username"
        placeholder="e.g. ravi"
        value={value.username}
        onChange={(e) => onChange({ ...value, username: e.target.value })}
        disabled={isEdit}
      />
      <div className="relative">
        <Input
          label={isEdit ? 'New Password (leave blank to keep)' : 'Password'}
          type={showPass ? 'text' : 'password'}
          placeholder={isEdit ? '••••••••' : 'Set a password'}
          value={value.password}
          onChange={(e) => onChange({ ...value, password: e.target.value })}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-3 bottom-3 text-[#7c7c7c] hover:text-white transition-colors"
        >
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

function validate(form, isEdit, students, editId) {
  if (!form.name.trim()) return 'Full name is required.'
  if (!isEdit && !form.username.trim()) return 'Username is required.'
  if (!isEdit && !form.password.trim()) return 'Password is required.'
  if (!isEdit) {
    const dup = students.find((s) => s.username === form.username.trim() && s.id !== editId)
    if (dup) return 'Username already exists. Choose another.'
  }
  return null
}

export function StudentManager() {
  const { students, addStudent, updateStudent, deleteStudent, results } = useData()

  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const openAdd = () => {
    setEditId(null); setForm(EMPTY_FORM); setFormError(''); setModalOpen(true)
  }

  const openEdit = (s) => {
    setEditId(s.id); setForm({ name: s.name, username: s.username, password: '' }); setFormError(''); setModalOpen(true)
  }

  const handleSave = () => {
    const err = validate(form, !!editId, students, editId)
    if (err) { setFormError(err); return }
    if (editId) {
      const update = { name: form.name }
      if (form.password.trim()) update.password = form.password
      updateStudent(editId, update)
    } else {
      addStudent({ name: form.name.trim(), username: form.username.trim(), password: form.password })
    }
    setModalOpen(false)
  }

  const filtered = students.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Students</h1>
          <p className="text-sm text-[#b3b3b3] mt-1">{students.length} registered students</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus size={15} /> Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name or username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-[#1f1f1f] text-white placeholder-[#7c7c7c] px-4 py-2.5 text-sm rounded-[500px] border border-transparent focus:outline-none focus:border-white transition-all"
          style={{ boxShadow: 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset' }}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No students found" description="Add student accounts using the button above." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#4d4d4d]">
                  {['#', 'Name', 'Username', 'Tests Taken', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold uppercase tracking-widest text-[#b3b3b3] px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const testCount = results.filter((r) => r.studentId === s.id).length
                  return (
                    <tr key={s.id} className="border-b border-[#1f1f1f] hover:bg-[#1f1f1f]/50 transition-colors">
                      <td className="px-5 py-4 text-[#4d4d4d] font-bold text-xs">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#1ed760] uppercase">{s.name[0]}</span>
                          </div>
                          <span className="font-bold text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#b3b3b3] font-normal">{s.username}</td>
                      <td className="px-5 py-4 text-[#b3b3b3]">{testCount}</td>
                      <td className="px-5 py-4 text-[#b3b3b3]">{s.createdAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="w-7 h-7 rounded-full bg-[#1f1f1f] hover:bg-[#252525] flex items-center justify-center text-[#b3b3b3] hover:text-white transition-all"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(s.id)}
                            className="w-7 h-7 rounded-full bg-[#1f1f1f] hover:bg-[#f3727f]/10 flex items-center justify-center text-[#b3b3b3] hover:text-[#f3727f] transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Student' : 'Add New Student'}>
        <StudentForm value={form} onChange={setForm} isEdit={!!editId} />
        {formError && <p className="text-xs text-[#f3727f] mt-3">{formError}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editId ? 'Save Changes' : 'Add Student'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Student">
        <p className="text-sm text-[#b3b3b3] mb-6">
          Are you sure you want to delete this student? All their test results will also be lost.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { deleteStudent(deleteConfirm); setDeleteConfirm(null) }}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  )
}
