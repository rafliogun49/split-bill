import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from '../../../test/setup'
import { Card } from './Card'

describe('Card', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Card>
        <p>Nasi Goreng</p>
      </Card>,
    )
    expect(getByText('Nasi Goreng')).toBeInTheDocument()
  })

  it('has no WCAG AAA violations', async () => {
    const { container } = render(
      <Card>
        <p>Nasi Goreng</p>
      </Card>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
