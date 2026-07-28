import { useEffect, useMemo, useState } from 'react'
import data from './data/vendors.json'

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sacci-theme') || 'system')
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    localStorage.setItem('sacci-theme', theme)
  }, [theme])
  const cycle = () => setTheme((t) => (t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'))
  return [theme, cycle]
}

function SectionHead({ name }) {
  return (
    <div className="section-head">
      <span className="name">{name}</span>
      <span className="rule" />
    </div>
  )
}

function NextAction({ action }) {
  if (!action) return null
  return (
    <div className={`next-action${action.crit ? ' crit' : ''}`}>
      <b>{action.label || 'Next'}</b>
      {action.text}
    </div>
  )
}

function Vendor({ vendor }) {
  return (
    <div className="vendor">
      <div className="vendor-head">
        <span className="vendor-name">{vendor.name}</span>
        <span className="vendor-role">{vendor.role}</span>
      </div>
      {vendor.lines.map((line, i) => (
        <div className="order-line" key={i}>
          <span className="ok">{line.label}</span>
          <span className="amt">{line.amount}</span>
        </div>
      ))}
      <NextAction action={vendor.nextAction} />
    </div>
  )
}

function Project({ project, collapsed, onToggle }) {
  return (
    <div className="project">
      <button className="project-head" onClick={onToggle} aria-expanded={!collapsed}>
        <span className="pname">{project.name}</span>
        <span className="pstage">
          <span className={`pill ${project.stage.type}`}>{project.stage.label}</span>
        </span>
        <span className="project-toggle" aria-hidden="true">{collapsed ? '+' : '−'}</span>
      </button>
      {!collapsed && (
        <div className="vendors">
          {project.vendors.map((v, i) => (
            <Vendor vendor={v} key={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [theme, cycleTheme] = useTheme()
  const { meta, kpis, projects, pending, contacts, provenance, footerNote } = data
  const themeLabel = theme === 'system' ? '◐ Auto' : theme === 'light' ? '☀ Light' : '☾ Dark'
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('all')
  const [attentionOnly, setAttentionOnly] = useState(false)
  const [collapsedProjects, setCollapsedProjects] = useState([])

  const filteredProjects = useMemo(() => {
    const term = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesStage = stage === 'all' || project.stage.type === stage
      const needsAttention = project.vendors.some((vendor) => vendor.nextAction)
      const matchesAttention = !attentionOnly || needsAttention
      const searchable = [
        project.name,
        project.stage.label,
        ...project.vendors.flatMap((vendor) => [
          vendor.name,
          vendor.role,
          vendor.nextAction?.label,
          vendor.nextAction?.text,
          ...vendor.lines.flatMap((line) => [line.label, line.amount]),
        ]),
      ].filter(Boolean).join(' ').toLowerCase()
      return matchesStage && matchesAttention && (!term || searchable.includes(term))
    })
  }, [attentionOnly, projects, query, stage])

  const filteredPending = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return pending
    return pending.filter((row) => Object.values(row).join(' ').toLowerCase().includes(term))
  }, [pending, query])

  const toggleProject = (name) => {
    setCollapsedProjects((current) => (
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    ))
  }

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <div className="brand-block">
            <div className="brand-mark">
              {meta.brand}
              <span className="dot">.</span>
            </div>
            <div className="tagline">{meta.tagline}</div>
          </div>
          <div className="sync-block">
            <span>
              Source: {meta.source} &nbsp;·&nbsp; Snapshot {meta.snapshot}
            </span>
            <button className="theme-toggle" onClick={cycleTheme} title="Toggle theme">
              {themeLabel}
            </button>
          </div>
        </div>
      </header>

      <div className="kpi-band">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="label">{k.label}</div>
            <div className="value mono">{k.value}</div>
            <div className="sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <main>
        <div className="project-toolbar">
          <div>
            <SectionHead name="By Project" />
            <p className="filter-summary">{filteredProjects.length} of {projects.length} projects shown</p>
          </div>
          <div className="filters" aria-label="Dashboard filters">
            <label className="search">
              <span className="sr-only">Search projects and vendors</span>
              <input
                type="search"
                placeholder="Search projects, vendors, items"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select value={stage} onChange={(event) => setStage(event.target.value)} aria-label="Filter by project status">
              <option value="all">All statuses</option>
              <option value="ok">In production</option>
              <option value="warn">Awaiting payment</option>
              <option value="crit">Blocked</option>
              <option value="info">Informational</option>
            </select>
            <button
              className={`filter-button${attentionOnly ? ' active' : ''}`}
              onClick={() => setAttentionOnly((current) => !current)}
              aria-pressed={attentionOnly}
            >
              Needs attention
            </button>
          </div>
        </div>
        {filteredProjects.length > 0 ? filteredProjects.map((p) => (
          <Project
            project={p}
            key={p.name}
            collapsed={collapsedProjects.includes(p.name)}
            onToggle={() => toggleProject(p.name)}
          />
        )) : <p className="empty-state">No projects match the current filters.</p>}

        <SectionHead name="Quoted — No PO Placed" />
        <div className="tablewrap">
          <table className="pending-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Vendor</th>
                <th>Qty</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredPending.map((row, i) => (
                <tr key={i}>
                  <td>{row.item}</td>
                  <td>{row.vendor}</td>
                  <td className="mono">{row.qty}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
              {filteredPending.length === 0 && (
                <tr><td colSpan="4" className="empty-cell">No pending quotes match the current search.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <SectionHead name="Vendor Reference" />
        <div className="contact-cards">
          {contacts.map((c, i) => (
            <div className="contact-card" key={i}>
              <h3>{c.name}</h3>
              <div className="sub">{c.sub}</div>
              {c.rows.map((r, j) => (
                <div className="contact-row" key={j}>
                  <span className="k">{r.k}</span>
                  <span className="v">{r.v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="provenance" style={{ marginTop: 18 }}>
          {provenance}
        </p>
      </main>

      <div className="foot">
        <span>{footerNote}</span>
        <span>Sources: sacci-kb wiki/ops + wiki/entities</span>
      </div>
    </>
  )
}
