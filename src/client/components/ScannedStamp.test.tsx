import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../../test/setup'
import { ScannedStamp } from './ScannedStamp'

describe('ScannedStamp', () => {
  it('renders the provenance label', () => {
    const { getByText } = render(<ScannedStamp />)
    expect(getByText('Scanned')).toBeInTheDocument()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(<ScannedStamp />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
