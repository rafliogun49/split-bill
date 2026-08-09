import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../test/setup'
import { App } from './App'

describe('App', () => {
  it('renders the wordmark', () => {
    const { getByText } = render(<App />)
    expect(getByText('SPLIT BILL')).toBeInTheDocument()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
