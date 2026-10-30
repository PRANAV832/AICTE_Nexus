import { useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router'
import { ArrowLeft, CheckCircle2, Clock3, Download, FileText, MessageSquareWarning, ShieldCheck, UserRound } from 'lucide-react'
import { applications } from '../data/mockData'
import type { ShellContext } from '../components/AppShell'
import { Button, Card, Heading, Modal, PageHeader, StatusBadge } from '../components/ui'

export function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notify } = useOutletContext<ShellContext>()
  const app = applications.find((item) => item.id === id) ?? applications[0]
  const [tab, setTab] = useState('Overview')
  const [action, setAction] = useState('')
  const tabs = ['Overview', 'Documents', 'Scrutiny', 'EVC', 'Compliance', 'Activity', 'Audit trail']

  return (
    <div className="page detail-page">
      <button className="back-link" onClick={() => navigate('/applications')}><ArrowLeft size={16} /> Back to applications</button>
      <PageHeader eyebrow={`${app.id} · ${app.type}`} title={app.institution} description={`${app.institutionId} · ${app.region} Region · Submitted ${app.submitted}`} actions={<><Button variant="secondary"><Download size={16} /> Download summary</Button><Button onClick={() => setAction('Forward application')}>Take next action</Button></>} />
      <div className="detail-layout">
        <div className="detail-main">
          <div className="tabs">{tabs.map((item) => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
          <Card>
            <div className="detail-title"><div><Heading level={2}>{tab === 'Overview' ? 'Application overview' : tab}</Heading><p>Verified prototype information linked to this application record.</p></div><StatusBadge value={app.status} /></div>
            {tab === 'Overview' ? (
              <>
                <div className="info-grid"><div><span>Application category</span><strong>{app.type}</strong></div><div><span>Current stage</span><strong>{app.stage}</strong></div><div><span>Academic year</span><strong>2026–27</strong></div><div><span>Regional office</span><strong>{app.region}</strong></div><div><span>Submission mode</span><strong>Institution portal</strong></div><div><span>Workflow route</span><strong>Scrutiny + EVC + SAC/SHC</strong></div></div>
                <Heading level={3} className="subsection-title">Approval workflow</Heading>
                <div className="vertical-timeline">{['Application submitted', 'Initial scrutiny completed', 'Clarification received', `Currently in ${app.stage}`, 'Final decision'].map((item, index) => <div className={index < 3 ? 'complete' : index === 3 ? 'current' : ''} key={item}><span>{index < 3 ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}</span><div><strong>{item}</strong><p>{index < 3 ? `Recorded by authorised actor · ${4 + index} March 2026` : index === 3 ? `${app.daysPending} days in current stage` : 'Awaiting preceding stages'}</p></div></div>)}</div>
              </>
            ) : (
              <div className="record-list">{[1, 2, 3].map((item) => <div key={item}><span><FileText size={18} /></span><div><strong>{tab} record {item}</strong><p>Source-backed record with actor, timestamp and current verification state.</p></div><StatusBadge value={item === 1 ? 'Verified' : 'Pending'} /></div>)}</div>
            )}
          </Card>
        </div>
        <aside className="context-panel">
          <div className="context-top"><span>Current status</span><StatusBadge value={app.status} /><Heading level={2}>{app.stage}</Heading><p>{app.daysPending} days in current stage</p></div>
          <div className="risk-meter"><div><span>Explainable risk score</span><strong>{app.riskScore}/100</strong></div><i><b style={{ width: `${app.riskScore}%` }} /></i><small><StatusBadge value={app.risk} /> Predicted risk, not an actual decision</small></div>
          <dl><div><dt><UserRound size={15} /> Assigned officer</dt><dd>{app.officer}</dd></div><div><dt><Clock3 size={15} /> Illustrative deadline</dt><dd>{app.deadline}</dd></div><div><dt><ShieldCheck size={15} /> Next prescribed action</dt><dd>Complete authorised stage review</dd></div></dl>
          <div className="context-actions"><Button onClick={() => setAction('Forward application')}>Forward to next stage</Button><Button variant="secondary" onClick={() => setAction('Request clarification')}>Request clarification</Button><Button variant="ghost" onClick={() => setAction('Record observation')}><MessageSquareWarning size={16} /> Record observation</Button></div>
          <p className="safeguard">All decisions require an authorised human actor. NEXUS does not autonomously approve or reject applications.</p>
        </aside>
      </div>
      {action && <Modal title={action} onClose={() => setAction('')}><form className="form-stack" onSubmit={(event) => { event.preventDefault(); setAction(''); notify(`${action} recorded with timestamp and actor`) }}><label>Reason and official note<textarea className="field textarea" required placeholder="Enter a clear reason for this action" /></label><label>Next stage<select className="field" defaultValue="EVC"><option>EVC</option><option>Re-scrutiny</option><option>SAC / SHC</option></select></label><p className="form-note">This prototype records the previous state, new state, actor, timestamp and reason.</p><div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setAction('')}>Cancel</Button><Button type="submit">Confirm authorised action</Button></div></form></Modal>}
    </div>
  )
}
