import type { Application, Institution } from '../types'

const names = [
  ['Aarohan Institute of Technology', 'Pune', 'Western'],
  ['Brahmaputra College of Engineering', 'Guwahati', 'North Eastern'],
  ['Chola Institute of Technical Studies', 'Chennai', 'Southern'],
  ['Deccan School of Engineering', 'Hyderabad', 'South Central'],
  ['Eastern Valley Polytechnic', 'Kolkata', 'Eastern'],
  ['Frontier Institute of Technology', 'Jaipur', 'Northern'],
  ['Ganga Technical University', 'Kanpur', 'Central'],
  ['Himalayan College of Engineering', 'Dehradun', 'Northern'],
  ['Indus Institute of Applied Sciences', 'Ahmedabad', 'Western'],
  ['Jnanadeep School of Technology', 'Bengaluru', 'Southern'],
  ['Konkan College of Engineering', 'Panaji', 'Western'],
  ['Lokmanya Institute of Technology', 'Nagpur', 'Central'],
  ['Malabar Technical College', 'Kozhikode', 'Southern'],
  ['Narmada Institute of Engineering', 'Bhopal', 'Central'],
  ['Odisha School of Technical Studies', 'Bhubaneswar', 'Eastern'],
  ['Pioneer College of Engineering', 'Chandigarh', 'Northern'],
  ['Ranchi Institute of Technology', 'Ranchi', 'Eastern'],
  ['Satpura College of Engineering', 'Jabalpur', 'Central'],
  ['Thar Institute of Applied Sciences', 'Jodhpur', 'Northern'],
  ['Western Institute of Engineering', 'Mumbai', 'Western'],
] as const

export const institutions: Institution[] = names.map((item, index) => ({
  id: `INST-${String(index + 1).padStart(4, '0')}`,
  name: item[0],
  city: item[1],
  region: item[2],
  category: index % 3 === 0 ? 'University' : index % 3 === 1 ? 'Private Institute' : 'Government Institute',
  compliance: 68 + ((index * 7) % 31),
}))

const stages = ['Scrutiny', 'Re-scrutiny', 'EVC', 'SAC / SHC', 'Final Decision']
const types = ['New Institution', 'Extension of Approval', 'New Course', 'Increase in Intake']
const officers = ['Ananya Rao', 'Vikram Singh', 'Meera Iyer', 'Arjun Das', 'Sana Khan', 'Rohit Mehta']

export const applications: Application[] = Array.from({ length: 52 }, (_, index) => {
  const institution = institutions[index % institutions.length]
  const daysPending = 2 + ((index * 7) % 43)
  const riskScore = Math.min(96, 18 + daysPending * 2 + (index % 9))
  const risk = riskScore >= 85 ? 'Critical' : riskScore >= 65 ? 'High' : riskScore >= 42 ? 'Medium' : 'Low'
  const status = index % 11 === 0 ? 'Approved' : daysPending > 34 ? 'Overdue' : index % 9 === 0 ? 'Returned' : 'Pending'
  return {
    id: `AP-2026-${String(1001 + index)}`,
    institutionId: institution.id,
    institution: institution.name,
    region: institution.region,
    type: types[index % types.length],
    stage: stages[index % stages.length],
    officer: officers[index % officers.length],
    submitted: `2026-0${1 + (index % 3)}-${String(3 + (index % 24)).padStart(2, '0')}`,
    daysPending,
    deadline: `2026-0${3 + (index % 2)}-${String(4 + (index % 24)).padStart(2, '0')}`,
    risk,
    riskScore,
    status,
  }
})

export const workflow = [
  { name: 'Submitted', count: 52, duration: '0.6 day', tone: 'done' },
  { name: 'Scrutiny', count: 18, duration: '8.4 days', tone: 'warning' },
  { name: 'Re-scrutiny', count: 7, duration: '5.2 days', tone: 'normal' },
  { name: 'EVC', count: 11, duration: '12.1 days', tone: 'critical' },
  { name: 'SAC / SHC', count: 6, duration: '4.8 days', tone: 'normal' },
  { name: 'Final Decision', count: 10, duration: '2.3 days', tone: 'done' },
]

export const monthlyTrend = [
  { month: 'Oct', pending: 24, completed: 18 },
  { month: 'Nov', pending: 29, completed: 22 },
  { month: 'Dec', pending: 27, completed: 28 },
  { month: 'Jan', pending: 35, completed: 24 },
  { month: 'Feb', pending: 32, completed: 31 },
  { month: 'Mar', pending: 38, completed: 29 },
]

export const regionPerformance = ['Northern', 'Western', 'Eastern', 'Southern', 'Central', 'North Eastern'].map((region) => {
  const records = applications.filter((item) => item.region === region)
  return {
    region,
    total: records.length,
    pending: records.filter((item) => item.status === 'Pending').length,
    overdue: records.filter((item) => item.status === 'Overdue').length,
    processing: `${9 + (region.length % 8)}.2d`,
    compliance: 74 + (region.length % 21),
  }
})

export const activities = [
  ['Scrutiny completed', 'AP-2026-1018 moved to EVC assessment', '7 min ago'],
  ['Document uploaded', 'Renewed lease deed added by Western Institute', '24 min ago'],
  ['Clarification received', 'AP-2026-1034 response submitted', '46 min ago'],
  ['EVC scheduled', 'Committee visit confirmed for 18 March', '1 hr ago'],
  ['Escalation triggered', 'AP-2026-1007 exceeded illustrative timeline', '2 hrs ago'],
]

export const alerts = [
  { title: '8 applications may breach timelines', meta: 'Within the next 5 days', tone: 'critical' },
  { title: '12 lease agreements approaching expiry', meta: 'Within the next 30 days', tone: 'warning' },
  { title: '5 EVC visits await scheduling', meta: 'Oldest pending for 9 days', tone: 'warning' },
  { title: '7 undertakings remain unfulfilled', meta: '3 are currently overdue', tone: 'critical' },
]
