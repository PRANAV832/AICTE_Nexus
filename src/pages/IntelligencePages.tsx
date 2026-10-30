import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, ArrowRight, Bot, Check, CheckCircle2, FileSearch, FileText, Play, Plus, RotateCcw, Send, Sparkles, Upload, ZoomIn, ZoomOut } from 'lucide-react'
import type { ShellContext } from '../components/AppShell'
import { applications, institutions, monthlyTrend, workflow } from '../data/mockData'
import { Button, Card, Heading, Input, PageHeader, SectionHeader, Select, StatusBadge } from '../components/ui'

export function CopilotPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<{ author: 'user' | 'ai'; text: string }[]>([
    { author: 'ai', text: 'Good morning. I can help research applications, institutional compliance, document validity and operational trends. My answers cite simulated source records for verification.' },
  ])
  const [input, setInput] = useState('')
  const prompts = ['Show lease expiries within 30 days', 'Which applications are in scrutiny for over 15 days?', 'Why is AP-2026-1042 high risk?', 'Which regions have the highest pending workload?']
  function submit(text = input) {
    if (!text.trim()) return
    setMessages((current) => [...current, { author: 'user', text }, { author: 'ai', text: `Based on 52 linked application records, I found 8 records relevant to “${text}”. The largest concentration is in the Western region. Review the supporting records before taking an authorised action.` }])
    setInput('')
  }
  return (
    <div className="page copilot-page">
      <PageHeader eyebrow="Source-backed regulatory research" title="NEXUS Intelligence" description="Your AI-powered regulatory research and compliance assistant." actions={<Button variant="secondary" onClick={() => setMessages(messages.slice(0, 1))}><Plus size={16} /> New conversation</Button>} />
      <div className="copilot-layout">
        <Card className="conversation-history"><SectionHeader title="Conversations" /><button className="selected">Regional workload analysis<small>Today, 10:42</small></button><button>Lease validity review<small>Yesterday</small></button><button>AP-2026-1042 summary<small>12 March</small></button></Card>
        <Card className="chat-card">
          <div className="chat-title"><span><Bot size={20} /></span><div><Heading level={2}>NEXUS Intelligence</Heading><p><i /> Connected to simulated application records</p></div></div>
          <div className="chat-messages">
            {messages.map((message, index) => <div key={index} className={`message ${message.author}`}><span>{message.author === 'ai' ? <Sparkles size={17} /> : 'AS'}</span><div><p>{message.text}</p>{message.author === 'ai' && index > 0 && <div className="source-box"><strong>Sources</strong><button onClick={() => navigate('/applications')}>Application registry · 8 records <ArrowRight size={13} /></button><button onClick={() => navigate('/reports')}>Regional pendency report <ArrowRight size={13} /></button></div>}</div></div>)}
          </div>
          {messages.length === 1 && <div className="suggested-prompts"><span>Try asking</span>{prompts.map((prompt) => <button onClick={() => submit(prompt)} key={prompt}>{prompt}<ArrowRight size={14} /></button>)}</div>}
          <form className="chat-input" onSubmit={(event) => { event.preventDefault(); submit() }}><Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about applications, institutions or compliance…" /><Button type="submit" aria-label="Send message"><Send size={17} /></Button></form>
          <p className="ai-disclaimer">AI-generated insights are advisory and must be verified by authorised officials.</p>
        </Card>
        <Card className="copilot-context"><SectionHeader title="Research context" /><div className="context-source"><FileText size={18} /><span><strong>Application registry</strong><small>52 simulated records</small></span><Check size={16} /></div><div className="context-source"><FileText size={18} /><span><strong>Compliance records</strong><small>20 institutions</small></span><Check size={16} /></div><div className="context-source"><FileText size={18} /><span><strong>Illustrative APH config</strong><small>Not official guidance</small></span><Check size={16} /></div></Card>
      </div>
    </div>
  )
}

export function RiskPage() {
  const highRisk = applications.filter((app) => ['High', 'Critical'].includes(app.risk)).sort((a, b) => b.riskScore - a.riskScore)
  return (
    <div className="page">
      <PageHeader eyebrow="Predictive intelligence · Explainable model" title="Predictive Risk Intelligence" description="Identify potential delays before they become administrative bottlenecks." actions={<Button variant="secondary">Configure criteria</Button>} />
      <div className="risk-summary"><Card><span>Applications analysed</span><strong>{applications.length}</strong><small>100% of active records</small></Card><Card><span>Elevated future risk</span><strong>{highRisk.length}</strong><small>Prediction, not overdue status</small></Card><Card><span>Actually overdue</span><strong>{applications.filter((a) => a.status === 'Overdue').length}</strong><small>Based on illustrative deadlines</small></Card><Card><span>Model refreshed</span><strong>09:42</strong><small>Today · Config v2.4</small></Card></div>
      <div className="risk-layout">
        <Card className="risk-list"><SectionHeader title="High-risk applications" subtitle="Ranked by validated, configurable criteria" />{highRisk.slice(0, 8).map((app) => <div className="risk-row" key={app.id}><div className={`risk-score ${app.risk.toLowerCase()}`}>{app.riskScore}</div><div><strong>{app.id} · {app.institution}</strong><p>{app.stage} · {app.daysPending} days pending</p><span>Stage ageing</span><span>Officer workload</span><span>Deadline proximity</span></div><div><StatusBadge value={app.risk} /><Button variant="ghost">Explain risk <ArrowRight size={14} /></Button></div></div>)}</Card>
        <Card className="why-risk"><span className="large-icon"><AlertTriangle size={24} /></span><Heading level={2}>Why is this application at risk?</Heading><p className="lead">AP-2026-1042 has a score of <strong>91/100</strong> based on four contributing factors.</p>{[['High stage ageing', '31%', 'critical'], ['Approaching deadline', '27%', 'warning'], ['Missing clarification', '23%', 'warning'], ['Officer workload', '19%', 'normal']].map(([name, value, tone]) => <div className="factor" key={name}><div><strong>{name}</strong><span>{value} contribution</span></div><i><b className={tone} style={{ width: value }} /></i></div>)}<div className="recommendation"><Sparkles size={17} /><p><strong>Recommended action</strong>Prioritise clarification follow-up and review workload allocation. Authorised review is required.</p></div></Card>
      </div>
    </div>
  )
}

export function DigitalTwinPage() {
  const [selected, setSelected] = useState(institutions[0])
  return (
    <div className="page">
      <PageHeader eyebrow="Institutional compliance intelligence" title="Institution Digital Twin" description="A unified, source-linked profile of institutional approvals, documents and obligations." actions={<Select value={selected.id} onChange={(event) => setSelected(institutions.find((item) => item.id === event.target.value) ?? institutions[0])}>{institutions.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</Select>} />
      <Card className="institution-hero"><div className="institution-logo">{selected.name.split(' ').slice(0, 2).map((word) => word[0]).join('')}</div><div><span>{selected.id}</span><Heading level={1}>{selected.name}</Heading><p>{selected.city} · {selected.region} Region · {selected.category}</p></div><div className="compliance-ring" style={{ '--score': `${selected.compliance * 3.6}deg` } as React.CSSProperties}><span><strong>{selected.compliance}</strong><small>Compliance monitoring</small></span></div></Card>
      <div className="twin-grid">
        <Card><SectionHeader title="Compliance overview" subtitle="Configurable indicators, not an approval criterion" /><div className="compliance-stats"><div><CheckCircle2 size={18} /><strong>28</strong><span>Verified documents</span></div><div><FileSearch size={18} /><strong>4</strong><span>Pending submissions</span></div><div><AlertTriangle size={18} /><strong>2</strong><span>Overdue undertakings</span></div><div><FileText size={18} /><strong>3</strong><span>Expiring documents</span></div></div><div className="category-bars">{[['Document validity', 92], ['Undertaking fulfilment', 74], ['Approval conditions', 86], ['Renewal readiness', 68]].map(([name, score]) => <div key={name}><span>{name}<strong>{score}%</strong></span><i><b style={{ width: `${score}%` }} /></i></div>)}</div></Card>
        <Card><SectionHeader title="Active compliance alerts" /><div className="record-list"><div><span className="warning"><AlertTriangle size={18} /></span><div><strong>Lease agreement renewal due</strong><p>Expires in 24 days · Human verification required</p></div><StatusBadge value="Warning" /></div><div><span className="critical"><AlertTriangle size={18} /></span><div><strong>Faculty undertaking overdue</strong><p>Evidence was due 8 days ago</p></div><StatusBadge value="Overdue" /></div></div></Card>
        <Card className="history-card"><SectionHeader title="Institution history" subtitle="Source-linked milestones and obligations" /><div className="timeline">{['Extension of Approval granted for 2025–26', 'Lease renewal verified by Regional Officer', 'Compliance evidence submitted', 'New course application entered scrutiny', 'Undertaking reminder acknowledged'].map((item, index) => <div key={item}><span>{index + 1}</span><div><strong>{item}</strong><p>{12 - index} March 2026 · Authorised record</p></div></div>)}</div></Card>
      </div>
    </div>
  )
}

export function DocumentPage() {
  const { notify } = useOutletContext<ShellContext>()
  const [uploaded, setUploaded] = useState(false)
  const [zoom, setZoom] = useState(90)
  return (
    <div className="page document-page">
      <PageHeader eyebrow="AI-assisted extraction · Human-controlled verification" title="Document Intelligence Center" description="Extract, compare and verify regulatory document information with full source traceability." actions={<label className="btn btn-primary upload-btn"><Upload size={16} /> Upload document<input type="file" accept=".pdf" onChange={() => { setUploaded(true); notify('Document uploaded for extraction') }} /></label>} />
      {!uploaded && <Card className="upload-zone"><Upload size={28} /><Heading level={2}>Drop a PDF for document intelligence</Heading><p>PDF up to 25 MB · OCR and metadata extraction are simulated in this prototype</p><label className="btn btn-secondary upload-btn">Choose document<input type="file" accept=".pdf" onChange={() => setUploaded(true)} /></label></Card>}
      <div className="document-workspace">
        <Card className="document-viewer"><div className="viewer-toolbar"><span><FileText size={17} /> lease-agreement-renewal.pdf</span><div><button onClick={() => setZoom(Math.max(60, zoom - 10))}><ZoomOut size={16} /></button><span>{zoom}%</span><button onClick={() => setZoom(Math.min(130, zoom + 10))}><ZoomIn size={16} /></button></div><span>Page 1 of 8</span></div><div className="paper" style={{ transform: `scale(${zoom / 100})` }}><span>LEASE AGREEMENT</span><div /><p>This illustrative document preview represents a source file submitted by the institution. Extracted fields on the right must be verified against the original.</p><p>The agreement is entered between the identified parties for premises associated with the technical institution.</p><div className="highlight">Expiry Date: 31 March 2026</div><p>Authorised signatures and annexures follow on subsequent pages.</p></div></Card>
        <Card className="extraction-panel"><div className="extraction-heading"><div><Heading level={2}>Extracted information</Heading><p>OCR confidence 94% · Review required</p></div><StatusBadge value="Pending verification" /></div><div className="extracted-fields">{[['Institution name', 'Aarohan Institute of Technology', 'matched'], ['Agreement number', 'LA/MH/2021/0842', 'matched'], ['Start date', '01 April 2021', 'matched'], ['Expiry date', '31 March 2026', 'mismatch'], ['Document type', 'Registered lease agreement', 'matched'], ['Parties involved', 'Institution Trust + Property Owner', 'matched']].map(([label, value, status]) => <label className={status} key={label}><span>{label}{status === 'mismatch' && <em>Database mismatch</em>}</span><Input defaultValue={value} /><small>{status === 'matched' ? 'Matched with institution record' : 'Database shows 30 June 2026'}</small></label>)}</div><div className="verification-actions"><Button onClick={() => notify('Document verified by authorised prototype user')}><Check size={16} /> Verify document</Button><Button variant="secondary" onClick={() => notify('Inconsistency flagged for review')}>Flag inconsistency</Button><Button variant="ghost">Request clarification</Button></div><p className="safeguard">AI extraction does not establish legal validity. Final verification remains under authorised human control.</p></Card>
      </div>
    </div>
  )
}

export function WorkflowPage() {
  const { notify } = useOutletContext<ShellContext>()
  const [selected, setSelected] = useState('EVC')
  return (
    <div className="page">
      <PageHeader eyebrow="Authorised configuration · Illustrative rules" title="Workflow Management" description="Configure application routes, stage responsibilities and escalation conditions without hardcoding regulatory rules." actions={<><Button variant="secondary">Version history</Button><Button onClick={() => notify('Draft workflow stage added')}><Plus size={16} /> Add stage</Button></>} />
      <div className="builder-layout"><Card className="workflow-builder"><div className="builder-toolbar"><strong>New Institution Approval · Draft v3</strong><span>Not active</span></div><div className="node-canvas">{workflow.map((node, index) => <div key={node.name} className={`flow-node ${selected === node.name ? 'selected' : ''}`} onClick={() => setSelected(node.name)}><span>{index + 1}</span><div><strong>{node.name}</strong><small>{index === 0 ? 'Mandatory' : index === 2 ? 'Conditional' : 'Configured stage'}</small></div>{index < workflow.length - 1 && <i><ArrowRight size={18} /></i>}</div>)}<button className="add-node" onClick={() => notify('New optional stage added to draft')}><Plus size={18} /> Add conditional stage</button></div></Card><Card className="config-panel"><SectionHeader title={`${selected} configuration`} subtitle="Changes require authorised publishing" /><label>Stage requirement<Select><option>Mandatory</option><option>Conditional</option><option>Optional</option></Select></label><label>Responsible role<Select><option>Regional Officer</option><option>EVC Committee</option><option>Bureau Admin</option></Select></label><label>Illustrative timeline<Input type="number" defaultValue="15" /></label><label>Transition condition<Select><option>Authorised review completed</option><option>Documents verified</option><option>Clarification received</option></Select></label><label>Return path<Select><option>Previous stage</option><option>Institution clarification</option><option>Configured exception route</option></Select></label><Button onClick={() => notify('Workflow draft saved')}>Save draft configuration</Button><p className="safeguard">These values are illustrative until configured against an authorised Approval Process Handbook.</p></Card></div>
    </div>
  )
}

export function SimulatorPage() {
  const [ran, setRan] = useState(false)
  const [officers, setOfficers] = useState(4)
  const output = useMemo(() => monthlyTrend.map((item) => ({ ...item, projected: Math.max(12, item.pending - officers * 2) })), [officers])
  return (
    <div className="page">
      <PageHeader eyebrow="Planning only · No operational changes" title="Workflow Simulation Lab" description="Explore how staffing, volume and committee availability could affect application pendency." />
      <div className="sim-layout"><Card className="sim-controls"><SectionHeader title="Scenario assumptions" /><label>Additional officers <Input type="range" min="0" max="12" value={officers} onChange={(event) => setOfficers(Number(event.target.value))} /><strong>+{officers}</strong></label><label>Incoming application volume<Select><option>Baseline</option><option>+15% increase</option><option>+30% increase</option></Select></label><label>Regional workload<Select><option>All India</option><option>Western Region</option><option>Northern Region</option></Select></label><label>EVC committee availability<Select><option>Current capacity</option><option>+2 committees</option><option>Reduced by 20%</option></Select></label><div className="sim-buttons"><Button onClick={() => setRan(true)}><Play size={16} /> Run simulation</Button><Button variant="secondary" onClick={() => { setRan(false); setOfficers(4) }}><RotateCcw size={16} /> Reset</Button></div></Card><Card className="sim-output"><SectionHeader title="Projected pendency" subtitle={ran ? 'Scenario complete · 4.2k simulated events' : 'Run the scenario to update projections'} /><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={output}><CartesianGrid stroke="#E4D9C9" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="pending" stroke="#E0745E" fill="#E0745E22" /><Area dataKey="projected" stroke="#0F3D3A" fill="#0F3D3A18" /></AreaChart></ResponsiveContainer></div><div className="simulation-kpis"><div><span>Estimated pendency</span><strong>{ran ? 21 : 38}</strong><small>{ran ? '−44.7% vs baseline' : 'Current baseline'}</small></div><div><span>Processing duration</span><strong>{ran ? '9.8d' : '14.2d'}</strong><small>Projected average</small></div><div><span>Likely bottleneck</span><strong>EVC</strong><small>Capacity constraint</small></div></div><p className="safeguard">Simulated projections are estimates based on assumptions and never change real assignments or regulatory decisions.</p></Card></div>
    </div>
  )
}
