import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../../test/setup'
import { Banner } from './Banner'

describe('Banner', () => {
  it('renders a neutral banner with a status role', () => {
    const { getByRole } = render(<Banner variant="neutral">Matches the receipt · Rp 156.177</Banner>)
    expect(getByRole('status')).toHaveTextContent('Matches the receipt')
  })

  it('renders an alert banner distinguished by text content, not only fill', () => {
    const { getByRole } = render(<Banner variant="alert">1 item unclaimed · Rp 8.000</Banner>)
    const banner = getByRole('alert')
    expect(banner).toHaveTextContent('Alert:')
    expect(banner).toHaveTextContent('1 item unclaimed')
  })

  it('gives neutral and alert banners different accessible roles', () => {
    const { getByRole: getNeutral } = render(<Banner variant="neutral">Quiet</Banner>)
    const { getByRole: getAlert } = render(<Banner variant="alert">Loud</Banner>)
    expect(getNeutral('status')).toBeInTheDocument()
    expect(getAlert('alert')).toBeInTheDocument()
  })

  it('has no WCAG AAA violations in either variant', async () => {
    const { container } = render(
      <>
        <Banner variant="neutral">Matches the receipt</Banner>
        <Banner variant="alert">Doesn't match the receipt</Banner>
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
