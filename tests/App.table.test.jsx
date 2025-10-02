import { render, screen, within } from '@testing-library/react'
import App from '../src/App.jsx'

describe('App hourly table', () => {
  it('renders 24 rows with placeholder numeric columns', () => {
    render(<App />)

    const table = screen.getByRole('table', {
      name: /prognos för stockholms timvisa väderuppdateringar/i,
    })

    const tbody = within(table).getAllByRole('rowgroup')[1]
    const rows = within(tbody).getAllByRole('row')
    expect(rows).toHaveLength(24)

    const firstRow = rows[0]
    const lastRow = rows.at(-1)

    expect(within(firstRow).getByRole('rowheader')).toHaveTextContent('00:00')
    expect(within(lastRow).getByRole('rowheader')).toHaveTextContent('23:00')

    const numericColumns = ['Temp (°C)', 'Nederbörd (mm)', 'Vind (m/s)', 'Luftfuktighet (%)']
    rows.forEach((row) => {
      const cells = within(row).getAllByRole('cell')
      expect(cells).toHaveLength(5)
      const [_weatherCell, ...metricCells] = cells
      metricCells.forEach((cell) => {
        expect(cell).toHaveTextContent('—')
      })
    })

    const headerRow = within(within(table).getAllByRole('rowgroup')[0]).getByRole('row')
    const headers = within(headerRow).getAllByRole('columnheader')
    const headerLabels = headers.map((header) => header.textContent)
    numericColumns.forEach((label) => {
      expect(headerLabels).toContain(label)
    })
  })
})
