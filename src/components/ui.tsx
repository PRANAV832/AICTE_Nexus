import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronRight, X } from 'lucide-react'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const fallbackClick = props.onClick ?? (props.type === 'submit' ? undefined : () => {
    const label = typeof children === 'string' ? children : 'Requested action'
    if (/export|download/i.test(label)) {
      const blob = new Blob(['AICTE NEXUS prototype export\nGenerated from simulated demonstration data.'], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'aicte-nexus-prototype-export.txt'
      anchor.click()
      URL.revokeObjectURL(url)
    }
    window.dispatchEvent(new CustomEvent('nexus-action', { detail: /export|download/i.test(label) ? 'Prototype export prepared' : `${label} selected` }))
  })
  return (
    <button className={`btn btn-${variant} ${className}`} {...props} onClick={fallbackClick}>
      {children}
    </button>
  )
}

export function IconButton({
  label,
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  const fallbackClick = props.onClick ?? (() => window.dispatchEvent(new CustomEvent('nexus-action', { detail: `${label} opened` })))
  return (
    <button aria-label={label} title={label} className={`icon-btn ${className}`} {...props} onClick={fallbackClick}>
      {children}
    </button>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`field ${props.className ?? ''}`} {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`field ${props.className ?? ''}`} {...props} />
}

export function Heading({
  level = 2,
  children,
  className = '',
}: {
  level?: 1 | 2 | 3 | 4
  children: ReactNode
  className?: string
}) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'
  return <Tag className={className}>{children}</Tag>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}

export function StatusBadge({ value }: { value: string }) {
  const key = value.toLowerCase().replaceAll(' ', '-').replace('/', '')
  return <span className={`badge badge-${key}`}>{value}</span>
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Heading level={1}>{title}</Heading>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="section-header">
      <div>
        <Heading level={2}>{title}</Heading>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <Heading level={2}>{title}</Heading>
          <IconButton label="Close dialog" onClick={onClose}><X size={18} /></IconButton>
        </div>
        {children}
      </section>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <div className="empty-symbol"><ChevronRight size={20} /></div>
      <Heading level={3}>{title}</Heading>
      <p>{description}</p>
    </div>
  )
}
