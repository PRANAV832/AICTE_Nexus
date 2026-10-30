import { createBrowserRouter } from 'react-router'
import { AppShell } from '../components/AppShell'
import { ApplicationDetail } from '../pages/ApplicationDetail'
import { ApplicationsPage } from '../pages/Applications'
import { CommandCenter } from '../pages/CommandCenter'
import { CopilotPage, DigitalTwinPage, DocumentPage, RiskPage, SimulatorPage, WorkflowPage } from '../pages/IntelligencePages'
import { ModulePage } from '../pages/ModulePage'

const moduleRoutes = [
  'analytics', 'scrutiny', 'evc', 'review', 'compliance', 'undertakings', 'lease-expiry',
  'notifications', 'escalations', 'reports', 'audit', 'regulatory-change', 'users', 'roles',
  'aph-rules', 'settings',
].map((kind) => ({ path: kind, element: <ModulePage kind={kind} /> }))

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppShell,
    children: [
      { index: true, Component: CommandCenter },
      { path: 'applications', Component: ApplicationsPage },
      { path: 'applications/:id', Component: ApplicationDetail },
      { path: 'workflow', Component: WorkflowPage },
      { path: 'copilot', Component: CopilotPage },
      { path: 'risk', Component: RiskPage },
      { path: 'digital-twin', Component: DigitalTwinPage },
      { path: 'documents', Component: DocumentPage },
      { path: 'simulator', Component: SimulatorPage },
      ...moduleRoutes,
      { path: '*', element: <ModulePage kind="analytics" /> },
    ],
  },
])
