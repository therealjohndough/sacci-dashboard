import { useEffect, useState } from 'react'
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

function Project({ project }) {
  return (
    <div className="project">
      <div className="project-head">
        <span className="pname">{project.name}</span>
        <span className="pstage">
          <span className={`pill ${project.stage.type}`}>{project.stage.label}</span>
        </span>
      </div>
      <div className="vendors">
        {project.vendors.map((v, i) => (
          <Vendor vendor={v} key={i} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [theme, cycleTheme] = useTheme()
  const { meta, kpis, projects, pending, contacts, provenance, footerNote } = data
  const themeLabel = theme === 'system' ? '◐ Auto' : theme === 'light' ? '☀ Light' : '☾ Dark'

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
        <SectionHead name="By Project" />
        {projects.map((p, i) => (
          <Project project={p} key={i} />
        ))}

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
              {pending.map((row, i) => (
                <tr key={i}>
                  <td>{row.item}</td>
                  <td>{row.vendor}</td>
                  <td className="mono">{row.qty}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
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
