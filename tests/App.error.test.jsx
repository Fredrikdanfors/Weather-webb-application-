import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../src/App.jsx'
import fixture from './fixtures/smhi-point.json'

describe('App error handling', () => {
  it('shows retry button after failure and recovers after retry', async () => {
    const initialNow = new Date('2024-10-01T12:00:00+02:00')

    fetch.mockRejectedValueOnce(new Error('network down'))
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fixture,
    })

    render(<App initialNow={initialNow} />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Kunde inte hämta prognos.')

    const retryButton = screen.getByRole('button', { name: 'Försök igen' })
    fireEvent.click(retryButton)

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))

    const temperatureCell = await screen.findByText('9.4')
    expect(temperatureCell).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
