import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [
          { id: 1, name: 'API Auth', status: 'Online' },
          { id: 2, name: 'Database', status: 'Online' },
          { id: 3, name: 'Payment Service', status: 'Online' }
        ]
      })
    ))
  })

  it('renders the dashboard title and services', async () => {
    render(<App />)

    expect(screen.getByText('Statut des services')).toBeInTheDocument()
    expect(screen.getByText('Dashboard de Monitoring DevOps')).toBeInTheDocument()

    expect(await screen.findByText('API Auth')).toBeInTheDocument()
    expect(await screen.findByText('Database')).toBeInTheDocument()
    expect(await screen.findByText('Payment Service')).toBeInTheDocument()
  })
})
