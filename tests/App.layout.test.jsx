import { render, screen, within } from '@testing-library/react'
import App from '../src/App.jsx'

describe('App layout', () => {
  it('renders hourly forecast table headers, footer, and populated title', () => {
    render(<App />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent?.trim()).not.toHaveLength(0)

    const table = screen.getByRole('table', {
      name: /prognos för stockholms timvisa väderuppdateringar/i,
    })
    const [headerGroup, bodyGroup] = within(table).getAllByRole('rowgroup')
    const headerRow = within(headerGroup).getByRole('row')
    const headers = within(headerRow).getAllByRole('columnheader')
    expect(headers).toHaveLength(6)
    const expectedHeaders = [
      'Tid',
      'Väder',
      'Temp (°C)',
      'Nederbörd (mm)',
      'Vind (m/s)',
      'Luftfuktighet (%)',
    ]
    expectedHeaders.forEach((name, index) => {
      expect(headers[index]).toHaveTextContent(name)
    })

    expect(screen.getByText('Data från SMHI')).toBeInTheDocument()

    // Ensure tbody renders but is currently empty
    expect(within(bodyGroup).queryAllByRole('row')).toHaveLength(0)
  })
})
