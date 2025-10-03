// Extends Vitest's expect assertions with DOM-specific matchers from Testing Library.
import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, vi } from 'vitest'

const defaultFetchImpl = () =>
  Promise.resolve({
    ok: true,
    json: async () => ({ timeSeries: [] }),
  })

beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn(defaultFetchImpl))
})

afterEach(() => {
  if (typeof fetch === 'function' && 'mockImplementation' in fetch) {
    fetch.mockImplementation(defaultFetchImpl)
    fetch.mockClear()
  }
})
