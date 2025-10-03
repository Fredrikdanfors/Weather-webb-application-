import { render, screen } from '@testing-library/react'
import App from '../src/App.jsx'

describe('App weather symbols', () => {
  it('renders correct icon and alt for known SMHI code', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        timeSeries: [
          {
            validTime: '2024-10-01T12:00:00Z',
            parameters: [
              { name: 'Wsymb2', values: [1] },
              { name: 't', values: [10] },
              { name: 'pmean', values: [0] },
              { name: 'ws', values: [2] },
              { name: 'r', values: [40] },
            ],
          },
        ],
      }),
    })

    render(<App initialNow={new Date('2024-10-01T12:00:00+02:00')} />)

    const icon = await screen.findByAltText('Klart')
    expect(icon).toHaveAttribute('src', expect.stringContaining('clear.svg'))
  })

  it('falls back to unknown icon for unmapped code', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        timeSeries: [
          {
            validTime: '2024-10-01T13:00:00Z',
            parameters: [
              { name: 'Wsymb2', values: [99] },
            ],
          },
        ],
      }),
    })

    render(<App initialNow={new Date('2024-10-01T13:00:00+02:00')} />)

    const icons = await screen.findAllByAltText('Okänt')
    expect(icons[0]).toHaveAttribute('src', expect.stringContaining('unknown.svg'))
  })
})
