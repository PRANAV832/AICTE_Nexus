import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ArrowDownUp, Download, Filter, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react'
import { applications } from '../data/mockData'
import { Button, Card, Input, PageHeader, Select, StatusBadge } from '../components/ui'

export function ApplicationsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState(params.get('region') ?? 'All')
  const [status, setStatus] = useState(params.get('status') ?? 'All')
  const [page, setPage] = useState(1)
  const [ascending, setAscending] = useState(true)
  const pageSize = 10
  const filtered = useMemo(() => applications.filter((app) =>
    (app.id.toLowerCase().includes(query.toLowerCase()) || app.institution.toLowerCase().includes(query.toLowerCase())) &&
    (region === 'All' || app.region === region) && (status === 'All' || app.status === status)
  ).sort((a, b) => ascending ? a.daysPending - b.daysPending : b.daysPending - a.daysPending), [query, region, status, ascending])
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="page">
      <PageHeader eyebrow="Approval management" title="Applications" description="Review, assign and progress approval applications through authorised workflow routes." actions={<><Button variant="secondary"><Download size={16} /> Export</Button><Button onClick={() => navigate('/?new=true')}>+ New application</Button></>} />
      <Card className="filter-card">
        <div className="filter-row">
          <div className="search-field"><Search size={17} /><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search application ID or institution" /></div>
          <Select aria-label="Filter by region" value={region} onChange={(event) => { setRegion(event.target.value); setPage(1) }}><option>All</option><option>Western</option><option>Northern</option><option>Eastern</option><option>Southern</option><option>Central</option><option>North Eastern</option></Select>
          <Select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option>All</option><option>Pending</option><option>Approved</option><option>Returned</option><option>Overdue</option></Select>
          <Select aria-label="Filter by stage"><option>All stages</option><option>Scrutiny</option><option>Re-scrutiny</option><option>EVC</option><option>SAC / SHC</option></Select>
          <Button variant="secondary"><SlidersHorizontal size={16} /> More filters</Button>
        </div>
        <div className="active-filters"><span><Filter size={14} /> {filtered.length} matching applications</span>{(query || region !== 'All' || status !== 'All') && <button onClick={() => { setQuery(''); setRegion('All'); setStatus('All') }}>Clear filters</button>}</div>
      </Card>

      <Card className="data-card">
        <div className="table-toolbar"><strong>Application registry</strong><span>Simulated records · Updated moments ago</span></div>
        <div className="table-scroll">
          <table className="application-table">
            <thead><tr><th>Application</th><th>Institution</th><th>Region</th><th>Type</th><th>Current stage</th><th>Assigned officer</th><th><button onClick={() => setAscending(!ascending)}>Days pending <ArrowDownUp size={13} /></button></th><th>Risk</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{visible.map((app) => (
              <tr key={app.id} onClick={() => navigate(`/applications/${app.id}`)}>
                <td><Link to={`/applications/${app.id}`}>{app.id}</Link><small>Submitted {app.submitted}</small></td>
                <td><strong>{app.institution}</strong><small>{app.institutionId}</small></td>
                <td>{app.region}</td><td>{app.type}</td><td><StatusBadge value={app.stage} /></td><td>{app.officer}</td>
                <td><strong className={app.daysPending > 34 ? 'danger-text' : ''}>{app.daysPending} days</strong><small>Due {app.deadline}</small></td>
                <td><StatusBadge value={app.risk} /></td><td><StatusBadge value={app.status} /></td>
                <td><button aria-label={`Actions for ${app.id}`}><MoreHorizontal size={18} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="pagination"><span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span><div><Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>{Array.from({ length: Math.ceil(filtered.length / pageSize) }, (_, i) => <button className={page === i + 1 ? 'active' : ''} key={i} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<Button variant="secondary" disabled={page >= Math.ceil(filtered.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button></div></div>
      </Card>
    </div>
  )
}
