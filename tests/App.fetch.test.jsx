import { render, screen, waitFor } from '@testing-library/react'
import App from '../src/App.jsx'
import fixture from './fixtures/smhi-point.json'

const endpoint =
  'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.0686/lat/59.3293/data.json'

describe('App SMHI integration', () => {
  it('renders transformed temperatures without showing a loading message', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fixture,
    })

    const initialNow = new Date('2024-10-01T12:00:00+02:00')

    render(<App initialNow={initialNow} />)

    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(fetch).toHaveBeenCalledWith(
      endpoint,
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      }),
    )

    const temperatureCell = await screen.findByText('9.4')
    expect(temperatureCell).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })
})
