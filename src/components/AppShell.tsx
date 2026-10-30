import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  Activity, AlertTriangle, Bell, Bot, Building2, CalendarDays, ChartNoAxesCombined, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, Command, FileClock, FileSearch, Files,
  FlaskConical, GitBranch, History, LayoutDashboard, Menu, Search, Settings, ShieldCheck, Sparkles,
  UserRoundCog, Users, X,
} from 'lucide-react'
import type { Role } from '../types'
import { Button, Heading, IconButton, Input, Modal, Select } from './ui'

type NavItem = { label: string; path: string; icon: typeof LayoutDashboard; restricted?: Role[] }
type NavGroup = { label: string; items: NavItem[] }

const nav: NavGroup[] = [
  { label: 'Overview', items: [
    { label: 'Command Center', path: '/', icon: LayoutDashboard },
    { label: 'Analytics & Insights', path: '/analytics', icon: ChartNoAxesCombined },
  ] },
  { label: 'Approval Management', items: [
    { label: 'Applications', path: '/applications', icon: Files },
    { label: 'Workflow Management', path: '/workflow', icon: GitBranch, restricted: ['Bureau Admin'] },
    { label: 'Scrutiny & Re-scrutiny', path: '/scrutiny', icon: FileSearch },
    { label: 'EVC Scheduling', path: '/evc', icon: CalendarDays },
    { label: 'SAC / SHC Review', path: '/review', icon: ClipboardCheck },
  ] },
  { label: 'Compliance', items: [
    { label: 'Institutional Compliance', path: '/compliance', icon: ShieldCheck },
    { label: 'Undertakings', path: '/undertakings', icon: ClipboardCheck },
    { label: 'Document Intelligence', path: '/documents', icon: FileSearch },
    { label: 'Lease Expiry Tracker', path: '/lease-expiry', icon: FileClock },
  ] },
  { label: 'Intelligence', items: [
    { label: 'AI Compliance Copilot', path: '/copilot', icon: Bot },
    { label: 'Predictive Risk', path: '/risk', icon: Activity },
    { label: 'Institution Digital Twin', path: '/digital-twin', icon: Building2 },
    { label: 'Workflow Simulator', path: '/simulator', icon: FlaskConical, restricted: ['Bureau Admin'] },
    { label: 'Regulatory Change', path: '/regulatory-change', icon: Sparkles, restricted: ['Bureau Admin'] },
  ] },
  { label: 'Administration', items: [
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Escalation Center', path: '/escalations', icon: AlertTriangle },
    { label: 'Reports', path: '/reports', icon: ChartNoAxesCombined },
    { label: 'Audit Trail', path: '/audit', icon: History, restricted: ['Bureau Admin', 'Regional Officer'] },
  ] },
  { label: 'System', items: [
    { label: 'User Management', path: '/users', icon: Users, restricted: ['Bureau Admin'] },
    { label: 'Roles & Permissions', path: '/roles', icon: UserRoundCog, restricted: ['Bureau Admin'] },
    { label: 'APH Rules & Configuration', path: '/aph-rules', icon: Settings, restricted: ['Bureau Admin'] },
    { label: 'Settings', path: '/settings', icon: Settings },
  ] },
]

const roleAllowedRoot: Record<Role, string> = {
  'Bureau Admin': '/',
  'Regional Officer': '/',
  'Institution Admin': '/applications',
  'EVC Committee': '/evc',
}

export type ShellContext = {
  role: Role
  notify: (message: string) => void
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  )
}

export function AppShell() {
  const [role, setRole] = useState<Role>('Bureau Admin')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [newAppOpen, setNewAppOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const currentItem = useMemo(() => nav.flatMap((group) => group.items).find((item) => item.path === location.pathname), [location])
  const blocked = currentItem?.restricted && !currentItem.restricted.includes(role)

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  function switchRole(nextRole: Role) {
    setRole(nextRole)
    setProfileOpen(false)
    if (currentItem?.restricted && !currentItem.restricted.includes(nextRole)) navigate(roleAllowedRoot[nextRole])
    notify(`Prototype role switched to ${nextRole}`)
  }

  useEffect(() => {
    const handleAction = (event: Event) => notify((event as CustomEvent<string>).detail)
    window.addEventListener('nexus-action', handleAction)
    return () => window.removeEventListener('nexus-action', handleAction)
  }, [])

  useEffect(() => {
    if (new URLSearchParams(location.search).get('new') === 'true') {
      setNewAppOpen(true)
      navigate(location.pathname, { replace: true })
    }
  }, [location.pathname, location.search, navigate])

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand-row">
          <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
            <BrandMark />
            {!collapsed && <span><strong>AICTE</strong> NEXUS<small>Regulation Bureau</small></span>}
          </Link>
          <IconButton label="Close navigation" className="mobile-only" onClick={() => setMobileOpen(false)}><X size={20} /></IconButton>
        </div>
        <nav className="side-nav" aria-label="Primary navigation">
          {nav.map((group) => (
            <div className="nav-group" key={group.label}>
              {!collapsed && <p>{group.label}</p>}
              {group.items.filter((item) => !item.restricted || item.restricted.includes(role)).map((item) => {
                const Icon = item.icon
                return (
                  <NavLink key={item.path} to={item.path} end={item.path === '/'} title={item.label} onClick={() => setMobileOpen(false)}>
                    <Icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <div><span className="status-dot" /> Systems operational<small>Illustrative prototype</small></div>}
          <IconButton label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <IconButton label="Open navigation" className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></IconButton>
            <div className="breadcrumb"><span>AICTE NEXUS</span><ChevronRight size={14} /><strong>{currentItem?.label ?? 'Command Center'}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="global-search">
              <Search size={17} />
              <Input aria-label="Global search" placeholder="Search applications, institutions…" />
              <kbd><Command size={11} /> K</kbd>
            </div>
            <IconButton label="Help and documentation"><CircleHelp size={19} /></IconButton>
            <div className="popover-wrap">
              <IconButton label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={19} /><span className="notification-count">6</span></IconButton>
              {notificationsOpen && (
                <div className="popover notification-popover">
                  <div className="popover-heading"><Heading level={3}>Notifications</Heading><span>6 unread</span></div>
                  {['Application AP-2026-1042 is approaching deadline', 'EVC schedule requires approval', 'Lease renewal uploaded for verification'].map((text) => (
                    <button key={text} onClick={() => { notify('Notification acknowledged'); setNotificationsOpen(false) }}><span />{text}<small>View details</small></button>
                  ))}
                  <Link to="/notifications" onClick={() => setNotificationsOpen(false)}>View notification center</Link>
                </div>
              )}
            </div>
            <Button onClick={() => setNewAppOpen(true)}>+ New Application</Button>
            <div className="popover-wrap profile-wrap">
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <span className="avatar">AS</span>
                <span><strong>Ananya Sharma</strong><small>{role} · All India</small></span>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="popover profile-popover">
                  <p>Switch prototype role</p>
                  {(['Bureau Admin', 'Regional Officer', 'Institution Admin', 'EVC Committee'] as Role[]).map((item) => (
                    <button key={item} className={role === item ? 'selected' : ''} onClick={() => switchRole(item)}>{item}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content" id="main-content">
          {blocked ? (
            <section className="access-denied">
              <ShieldCheck size={36} />
              <Heading level={1}>Authorised access required</Heading>
              <p>This module is not available to the active {role} role. Route access is checked independently of navigation visibility.</p>
              <Button onClick={() => navigate(roleAllowedRoot[role])}>Return to role dashboard</Button>
            </section>
          ) : <Outlet context={{ role, notify } satisfies ShellContext} />}
        </main>
      </div>

      {newAppOpen && (
        <Modal title="Start a new application" onClose={() => setNewAppOpen(false)}>
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setNewAppOpen(false); notify('Draft application created successfully') }}>
            <label>Institution<Select required defaultValue=""><option value="" disabled>Select institution</option><option>Aarohan Institute of Technology</option><option>Western Institute of Engineering</option></Select></label>
            <label>Application category<Select required defaultValue=""><option value="" disabled>Select category</option><option>New Institution</option><option>Extension of Approval</option><option>New Course</option></Select></label>
            <label>Academic year<Select defaultValue="2026-27"><option>2026-27</option><option>2027-28</option></Select></label>
            <p className="form-note">A draft will be created. No regulatory submission occurs until an authorised user completes and submits the application.</p>
            <div className="modal-actions"><Button type="button" variant="secondary" onClick={() => setNewAppOpen(false)}>Cancel</Button><Button type="submit">Create draft</Button></div>
          </form>
        </Modal>
      )}
      {toast && <div className="toast"><span><ShieldCheck size={17} /></span>{toast}</div>}
    </div>
  )
}
