import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, CircleDot, ClipboardList, Files, Sparkles, Timer } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { activities, alerts, applications, monthlyTrend, regionPerformance, workflow } from '../data/mockData'
import { Button, Card, Heading, PageHeader, SectionHeader } from '../components/ui'

const kpis = [
  { label: 'Total Applications', value: applications.length, detail: '+8.4% vs last period', icon: Files, tone: 'forest', path: '/applications' },
  { label: 'Pending Applications', value: applications.filter((a) => a.status === 'Pending').length, detail: '4 moved today', icon: Timer, tone: 'gold', path: '/applications?status=Pending' },
  { label: 'Approved Applications', value: applications.filter((a) => a.status === 'Approved').length, detail: '+12.1% completion', icon: CheckCircle2, tone: 'success', path: '/applications?status=Approved' },
  { label: 'Applications at Risk', value: applications.filter((a) => ['High', 'Critical'].includes(a.risk)).length, detail: '3 require action', icon: AlertTriangle, tone: 'clay', path: '/risk' },
  { label: 'Overdue Cases', value: applications.filter((a) => a.status === 'Overdue').length, detail: 'Illustrative timeline', icon: CalendarClock, tone: 'critical', path: '/escalations' },
  { label: 'Pending EVCs', value: applications.filter((a) => a.stage === 'EVC' && a.status === 'Pending').length, detail: '2 ready to schedule', icon: ClipboardList, tone: 'info', path: '/evc' },
]

const pieData = ['Scrutiny', 'Re-scrutiny', 'EVC', 'SAC / SHC', 'Final Decision'].map((name) => ({
  name, value: applications.filter((a) => a.stage === name).length,
}))
const chartColors = ['#0F3D3A', '#F4B13B', '#E0745E', '#668B9B', '#36866B']

export function CommandCenter() {
  const navigate = useNavigate()
  const avgPendency = useMemo(() => Math.round(applications.reduce((sum, item) => sum + item.daysPending, 0) / applications.length), [])

  return (
    <div className="page command-page">
      <PageHeader
        eyebrow="All India · Live operational view"
        title="Regulatory Command Center"
        description="Real-time intelligence across applications, institutional compliance and approval workflows."
        actions={<><Button variant="secondary">Export briefing</Button><Button onClick={() => navigate('/analytics')}>View analytics <ArrowRight size={16} /></Button></>}
      />

      <div className="status-strip">
        <span><i /> All services operational</span>
        <span>Last refreshed 2 minutes ago</span>
        <span>Data shown is simulated for demonstration</span>
      </div>

      <div className="kpi-grid">
        {kpis.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.label} className={`kpi-card tone-${item.tone}`} onClick={() => navigate(item.path)}>
              <span className="kpi-icon"><Icon size={19} /></span>
              <span className="kpi-value">{item.value.toLocaleString()}</span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
              <ArrowRight className="kpi-arrow" size={16} />
            </button>
          )
        })}
      </div>

      <Card className="workflow-card">
        <SectionHeader title="Application workflow overview" subtitle={`Current stage distribution · Average active pendency ${avgPendency} days`} action={<Button variant="ghost" onClick={() => navigate('/workflow')}>Manage workflow <ArrowRight size={15} /></Button>} />
        <div className="workflow-track">
          {workflow.map((step, index) => (
            <div className={`workflow-step ${step.tone}`} key={step.name}>
              <div className="workflow-node"><span>{index + 1}</span>{index < workflow.length - 1 && <i />}</div>
              <strong>{step.name}</strong>
              <span>{step.count} applications</span>
              <small>Avg. {step.duration}</small>
              {step.tone === 'critical' && <em>Bottleneck</em>}
            </div>
          ))}
        </div>
        <div className="workflow-legend"><span><i className="mandatory" /> Mandatory stage</span><span><i className="conditional" /> Conditional route</span><span><CircleDot size={13} /> Routes vary by configured application category</span></div>
      </Card>

      <div className="dashboard-grid">
        <Card className="chart-wide">
          <SectionHeader title="Application pendency trend" subtitle="Monthly pending vs completed applications" action={<select className="compact-select" aria-label="Chart date range"><option>Last 6 months</option><option>Last 12 months</option></select>} />
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                <defs><linearGradient id="pending" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4B13B" stopOpacity=".35" /><stop offset="100%" stopColor="#F4B13B" stopOpacity=".03" /></linearGradient></defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#E4D9C9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64716C', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64716C', fontSize: 12 }} />
                <Tooltip contentStyle={{ border: '1px solid #E4D9C9', borderRadius: 12 }} />
                <Area type="monotone" dataKey="pending" stroke="#E5A12E" strokeWidth={2.5} fill="url(#pending)" />
                <Area type="monotone" dataKey="completed" stroke="#0F3D3A" strokeWidth={2.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend"><span><i className="gold" /> Pending</span><span><i className="forest" /> Completed</span></div>
        </Card>

        <Card>
          <SectionHeader title="Applications by stage" subtitle={`${applications.length} active records`} />
          <div className="donut-row">
            <div className="donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={pieData} dataKey="value" innerRadius={52} outerRadius={76} paddingAngle={3}>{pieData.map((_, i) => <Cell key={i} fill={chartColors[i]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
              <span><strong>{applications.length}</strong><small>Total</small></span>
            </div>
            <div className="stage-legend">{pieData.map((item, i) => <div key={item.name}><i style={{ background: chartColors[i] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div>
          </div>
        </Card>

        <Card className="regional-card">
          <SectionHeader title="Regional performance" subtitle="Operational throughput by regional grouping" action={<Button variant="ghost" onClick={() => navigate('/reports')}>Full report <ArrowRight size={15} /></Button>} />
          <div className="table-scroll">
            <table>
              <thead><tr><th>Region</th><th>Total</th><th>Pending</th><th>Overdue</th><th>Avg. processing</th><th>Compliance</th></tr></thead>
              <tbody>{regionPerformance.map((item) => <tr key={item.region}><td><strong>{item.region}</strong></td><td>{item.total}</td><td>{item.pending}</td><td className={item.overdue ? 'danger-text' : ''}>{item.overdue}</td><td>{item.processing}</td><td><div className="progress-cell"><span><i style={{ width: `${item.compliance}%` }} /></span>{item.compliance}%</div></td></tr>)}</tbody>
            </table>
          </div>
        </Card>

        <Card className="attention-card">
          <SectionHeader title="Critical attention required" subtitle="Prioritised by urgency and impact" />
          <div className="alert-list">{alerts.map((item) => <button key={item.title} onClick={() => navigate('/escalations')}><span className={item.tone}><AlertTriangle size={17} /></span><span><strong>{item.title}</strong><small>{item.meta}</small></span><ChevronRightIcon /></button>)}</div>
        </Card>

        <Card className="ai-insights">
          <div className="ai-heading"><span><Sparkles size={18} /></span><div><Heading level={2}>NEXUS Intelligence</Heading><p>Source-backed operational insights</p></div><b>AI</b></div>
          <div className="insight-feature"><p>Western Region currently has the highest concentration of applications awaiting scrutiny.</p><button onClick={() => navigate('/applications?region=Western')}>Review 9 supporting records <ArrowRight size={14} /></button></div>
          <div className="mini-insights"><p><strong>12 institutions</strong> have lease agreements approaching expiry within 30 days.</p><p><strong>8 applications</strong> show elevated timeline risk based on stage ageing.</p></div>
          <Button variant="secondary" onClick={() => navigate('/copilot')}>Ask NEXUS Intelligence</Button>
          <small className="ai-disclaimer">AI-generated insights are advisory and must be verified by authorised officials.</small>
        </Card>

        <Card className="activity-card">
          <SectionHeader title="Recent activity" subtitle="Across applications and compliance" action={<Button variant="ghost" onClick={() => navigate('/audit')}>Audit trail</Button>} />
          <div className="timeline">{activities.map(([title, text, time], index) => <div key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{text}</p></div><small>{time}</small></div>)}</div>
        </Card>
      </div>
    </div>
  )
}

function ChevronRightIcon() {
  return <ArrowRight size={16} />
}
