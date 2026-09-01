import React, { useEffect, useState } from 'react'

const statusColors = {
  Online: '#22c55e',
  Degraded: '#f59e0b',
  Offline: '#ef4444'
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}h ${m}m ${s}s`
}

export default function App() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startTs] = useState(() => Date.now())
  const [uptime, setUptime] = useState(0)

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    const t = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTs) / 1000))
    }, 1000)
    return () => clearInterval(t)
  }, [startTs])

  async function loadServices() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/api/services`)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function randomStatus() {
    const list = ['Online', 'Degraded', 'Offline']
    return list[Math.floor(Math.random() * list.length)]
  }

  // Simulate incident locally (backend not mutating state)
  function simulateIncident() {
    setServices(prev => {
      if (!prev.length) return prev
      const idx = Math.floor(Math.random() * prev.length)
      return prev.map((s, i) => (i === idx ? { ...s, status: randomStatus() } : s))
    })
  }

  function resetAll() {
    setServices(prev => prev.map(s => ({ ...s, status: 'Online' })))
  }

  const containerStyle = {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    padding: 20,
    maxWidth: 900,
    margin: '0 auto',
    color: '#0f172a'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  }

  const card = {
    background: '#fff',
    borderRadius: 12,
    padding: 18,
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)'
  }

  const listStyle = {
    marginTop: 16,
    display: 'grid',
    gap: 12
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Statut des services</h1>
          <p style={{ margin: '6px 0 0', color: '#475569' }}>Dashboard de Monitoring DevOps</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Uptime</div>
          <div style={{ fontWeight: 700 }}>{formatUptime(uptime)}</div>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Services</div>
            <div style={{ color: '#64748b', fontSize: 13, alignSelf: 'center' }}>{services.length} microservices</div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={simulateIncident} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
              Simuler un incident
            </button>
            <button onClick={resetAll} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
              Réinitialiser
            </button>
            <button onClick={loadServices} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
              Rafraîchir
            </button>
          </div>
        </div>

        <div style={listStyle}>
          {loading && <div style={{ color: '#64748b' }}>Chargement...</div>}
          {error && <div style={{ color: '#ef4444' }}>Erreur: {error}</div>}
          {!loading && !error && services.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: '#f8fafc' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>ID: {s.id}</div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 99, background: statusColors[s.status] }} />
                  <div style={{ fontWeight: 700 }}>{s.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
