import { render, screen, within } from '@testing-library/react'
import App from '../src/App.jsx'
import fixture from './fixtures/smhi-point.json'

const endpoint =
  'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.0686/lat/59.3293/data.json'

describe('App accessibility', () => {
  it('ensures table semantics and weather icon alt text are correct', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fixture,
    })

    render(<App initialNow={new Date('2024-10-01T12:00:00+02:00')} />)

    const table = await screen.findByRole('table', {
      name: /väder per timme i stockholm/i,
    })
    expect(table).toBeInTheDocument()

    const headers = within(table).getAllByRole('columnheader')
    expect(headers).toHaveLength(6)

    const icon = await screen.findByAltText('Klart')
    expect(icon).toHaveAttribute('src', expect.stringContaining('clear.svg'))

    expect(fetch).toHaveBeenCalledWith(
      endpoint,
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })
})
