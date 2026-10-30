import { useState } from 'react'
import { useOutletContext } from 'react-router'
import { CalendarDays, CheckCircle2, Download, FileText, Filter, MoreHorizontal, Search, Settings2 } from 'lucide-react'
import type { ShellContext } from '../components/AppShell'
import { applications } from '../data/mockData'
import { Button, Card, Input, PageHeader, SectionHeader, Select, StatusBadge } from '../components/ui'

const configs: Record<string, { eyebrow: string; title: string; description: string; tabs: string[] }> = {
  analytics: { eyebrow: 'Operational reporting', title: 'Analytics & Insights', description: 'Explore application, workload and compliance performance across regions.', tabs: ['Overview', 'Pendency', 'Processing time', 'Regional trends'] },
  scrutiny: { eyebrow: 'Approval management', title: 'Scrutiny & Re-scrutiny', description: 'Review assigned cases, observations and institutional clarifications.', tabs: ['Awaiting scrutiny', 'Re-scrutiny', 'Clarification received', 'Completed'] },
  evc: { eyebrow: 'Inspection management', title: 'EVC Scheduling', description: 'Coordinate committee availability, institutional visits and inspection reporting.', tabs: ['Calendar', 'Pending queue', 'Assignments', 'Reports'] },
  review: { eyebrow: 'Committee review', title: 'SAC / SHC Review', description: 'Manage agenda-ready applications and authorised committee decisions.', tabs: ['Upcoming agenda', 'Under review', 'Decision recorded'] },
  compliance: { eyebrow: 'Institutional oversight', title: 'Institutional Compliance', description: 'Monitor conditions, evidence, obligations and verification outcomes.', tabs: ['All institutions', 'Awaiting evidence', 'Verification queue', 'Completed'] },
  undertakings: { eyebrow: 'Compliance management', title: 'Undertakings', description: 'Track institutional commitments, evidence deadlines and authorised verification.', tabs: ['All undertakings', 'Upcoming', 'Submitted', 'Awaiting verification', 'Overdue'] },
  'lease-expiry': { eyebrow: 'Document validity', title: 'Lease Expiry Tracker', description: 'Prioritise renewal submissions and validity verification by expiry horizon.', tabs: ['Within 7 days', '15 days', '30 days', '60 days', 'Expired'] },
  notifications: { eyebrow: 'Alert management', title: 'Notifications', description: 'Review, acknowledge and trace operational notifications across the platform.', tabs: ['All', 'Unread', 'Applications', 'Compliance', 'EVC'] },
  escalations: { eyebrow: 'Accountability', title: 'Escalation Center', description: 'Manage authorised, configurable escalation chains and resolution tracking.', tabs: ['Active', 'Approaching', 'Resolved', 'Rules'] },
  reports: { eyebrow: 'Reporting', title: 'Reports Library', description: 'Build, preview and export source-linked operational reports.', tabs: ['All reports', 'Applications', 'Compliance', 'EVC', 'Audit'] },
  audit: { eyebrow: 'Immutable accountability record', title: 'Audit Trail', description: 'Inspect actor, state transition, timestamp and reason for every recorded action.', tabs: ['All events', 'Applications', 'Configuration', 'Access'] },
  'regulatory-change': { eyebrow: 'Handbook comparison', title: 'Regulatory Change Impact Analyzer', description: 'Compare handbook versions and review affected workflows before activation.', tabs: ['Compare versions', 'Clause changes', 'Impact review', 'Approval history'] },
  users: { eyebrow: 'System administration', title: 'User Management', description: 'Manage user access, regional assignment and account lifecycle.', tabs: ['All users', 'Active', 'Invited', 'Suspended'] },
  roles: { eyebrow: 'Access control', title: 'Roles & Permissions', description: 'Configure least-privilege access to modules and authorised actions.', tabs: ['Roles', 'Permission matrix', 'Assignment history'] },
  'aph-rules': { eyebrow: 'Authorised configuration', title: 'APH Rules & Configuration', description: 'Maintain versioned illustrative rules pending authorised handbook alignment.', tabs: ['Rule sets', 'Deadlines', 'Application routes', 'Change log'] },
  settings: { eyebrow: 'Preferences', title: 'System Settings', description: 'Configure personal notifications, display preferences and platform defaults.', tabs: ['General', 'Notifications', 'Regions', 'Document categories'] },
}

export function ModulePage({ kind }: { kind: string }) {
  const { notify } = useOutletContext<ShellContext>()
  const config = configs[kind] ?? configs.analytics
  const [tab, setTab] = useState(config.tabs[0])
  const [query, setQuery] = useState('')
  const records = applications.filter((item) => `${item.id} ${item.institution} ${item.region}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
  return (
    <div className="page">
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} actions={<><Button variant="secondary"><Download size={16} /> Export</Button><Button onClick={() => notify(`${config.title} action completed in prototype`)}>{kind === 'reports' ? 'Create report' : kind === 'evc' ? 'Schedule inspection' : 'Create record'}</Button></>} />
      <div className="tabs">{config.tabs.map((item) => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
      {kind === 'evc' && <Card className="calendar-strip">{['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20'].map((day, index) => <div className={index === 2 ? 'selected' : ''} key={day}><CalendarDays size={17} /><strong>{day}</strong><span>{index + 1} visits</span></div>)}</Card>}
      {kind === 'regulatory-change' && <div className="compare-strip"><Card><FileText size={22} /><strong>APH Version A</strong><Select><option>Illustrative 2025–26</option></Select></Card><span>compared with</span><Card><FileText size={22} /><strong>APH Version B</strong><Select><option>Draft 2026–27</option></Select></Card></div>}
      <Card className="data-card">
        <SectionHeader title={tab} subtitle={`${records.length} source-linked prototype records`} action={<div className="mini-search"><Search size={15} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" /></div>} />
        <div className="filter-line"><Button variant="secondary"><Filter size={15} /> Filters</Button><Select><option>All regions</option><option>Western</option><option>Northern</option></Select><Select><option>All statuses</option><option>Pending</option><option>Overdue</option></Select></div>
        <div className="table-scroll"><table><thead><tr><th>Record</th><th>Institution / entity</th><th>Category</th><th>Region</th><th>Responsible actor</th><th>Status</th><th>Updated</th><th /></tr></thead><tbody>{records.map((item, index) => <tr key={item.id}><td><strong>{kind === 'audit' ? `EVT-${8001 + index}` : item.id}</strong><small>{kind === 'audit' ? 'State transition recorded' : item.type}</small></td><td><strong>{item.institution}</strong><small>{item.institutionId}</small></td><td>{kind === 'lease-expiry' ? 'Lease agreement' : kind === 'undertakings' ? 'Institution undertaking' : item.stage}</td><td>{item.region}</td><td>{item.officer}</td><td><StatusBadge value={item.status} /></td><td>{index + 2}h ago</td><td><button onClick={() => notify('Record opened')}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
      </Card>
      <div className="module-footer-note"><CheckCircle2 size={16} /><span>All displayed records are simulated. Authorised actions are timestamped and preserve previous state.</span><Button variant="ghost"><Settings2 size={15} /> Configure view</Button></div>
    </div>
  )
}
