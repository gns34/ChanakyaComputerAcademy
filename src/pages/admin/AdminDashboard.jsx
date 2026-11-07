// AdminDashboard.jsx — Stats overview for admin
import { useData } from '../../contexts/DataContext'
import { Card } from '../../components/ui/Card'
import { Layout } from '../../components/layout/Layout'
import { Users, HelpCircle, BarChart2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AdminDashboard() {
  const { students, questions, results } = useData()
  const navigate = useNavigate()

  const avgScore = results.length
    ? Math.round(
        results.reduce((sum, r) => sum + (r.total > 0 ? (r.score / r.total) * 100 : 0), 0) /
          results.length
      )
    : 0

  const stats = [
    {
      label: 'Total Students',
      value: students.length,
      icon: Users,
      color: '#539df5',
      link: '/admin/students',
    },
    {
      label: 'Total Questions',
      value: questions.length,
      icon: HelpCircle,
      color: '#1ed760',
      link: '/admin/questions',
    },
    {
      label: 'Tests Taken',
      value: results.length,
      icon: BarChart2,
      color: '#ffa42b',
      link: '/admin/results',
    },
    {
      label: 'Avg. Score',
      value: `${avgScore}%`,
      icon: TrendingUp,
      color: '#f3727f',
      link: '/admin/results',
    },
  ]

  // Recent results
  const recent = [...results]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-[#b3b3b3] mt-1">
          Overview of Chanakya Computer Academy portal
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <div
            key={label}
            onClick={() => navigate(link)}
            className="bg-[#181818]/80 backdrop-blur-md rounded-[8px] p-5 border border-white/[0.06] hover:border-[#1ed760]/35 hover:bg-[#1f1f1f]/90 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-all duration-250 ease-out cursor-pointer group"
            style={{ boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
              style={{ background: `${color}20`, border: `1px solid ${color}40` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-xs text-[#b3b3b3] mt-0.5 uppercase tracking-widest font-semibold">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <h2 className="text-base font-bold text-white mb-4">Recent Test Activity</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-[#b3b3b3] py-8 text-center">No tests taken yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#4d4d4d]">
                  {['Student', 'Score', 'Percentage', 'Date'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-bold uppercase tracking-widest text-[#b3b3b3] pb-3 pr-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => {
                  const student = students.find((s) => s.id === r.studentId)
                  const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0
                  const color = pct >= 70 ? '#1ed760' : pct >= 40 ? '#ffa42b' : '#f3727f'
                  return (
                    <tr key={r.id} className="border-b border-[#1f1f1f] hover:bg-[#1f1f1f]/80 transition-colors duration-150">
                      <td className="py-3 pr-4 font-normal text-white">
                        {student?.name ?? 'Unknown'}
                      </td>
                      <td className="py-3 pr-4 text-[#b3b3b3]">
                        {r.score}/{r.total}
                      </td>
                      <td className="py-3 pr-4" style={{ color }}>
                        {pct}%
                      </td>
                      <td className="py-3 text-[#b3b3b3]">
                        {new Date(r.date).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  )
}
