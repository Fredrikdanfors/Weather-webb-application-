// Smoke test that ensures the root component renders without crashing.
import { render, screen } from '@testing-library/react'
import App from '../src/App.jsx'

describe('App', () => {
  it('displays the scaffold headline', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /stockholm weather/i }),
    ).toBeInTheDocument()
  })
})
