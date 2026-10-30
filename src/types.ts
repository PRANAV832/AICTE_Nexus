export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type ApplicationStatus = 'Pending' | 'Approved' | 'Returned' | 'Overdue'

export interface Institution {
  id: string
  name: string
  city: string
  region: string
  category: string
  compliance: number
}

export interface Application {
  id: string
  institutionId: string
  institution: string
  region: string
  type: string
  stage: string
  officer: string
  submitted: string
  daysPending: number
  deadline: string
  risk: RiskLevel
  riskScore: number
  status: ApplicationStatus
}

export type Role = 'Bureau Admin' | 'Regional Officer' | 'Institution Admin' | 'EVC Committee'
