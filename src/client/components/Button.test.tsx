import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '../../../test/setup'
import { Button, type ButtonVariant } from './Button'

const variants: ButtonVariant[] = ['primary', 'secondary', 'danger']

describe('Button', () => {
  it.each(variants)('renders black text and no white text in the %s variant', (variant) => {
    const { getByRole } = render(<Button variant={variant}>Claim</Button>)
    const button = getByRole('button', { name: 'Claim' })
    expect(button.className).toContain('text-on-surface')
    expect(button.className).not.toMatch(/text-white|on-primary|on-secondary|on-error|#fff/i)
  })

  it('renders black text when disabled too', () => {
    const { getByRole } = render(<Button disabled>Claim</Button>)
    expect(getByRole('button').className).toContain('text-on-surface')
  })

  it('exposes disabled to assistive technology, not merely a grey fill', () => {
    const { getByRole } = render(<Button disabled>Claim</Button>)
    const button = getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('calls onClick when enabled', () => {
    const onClick = vi.fn()
    const { getByRole } = render(<Button onClick={onClick}>Claim</Button>)
    fireEvent.click(getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    const { getByRole } = render(
      <Button disabled onClick={onClick}>
        Claim
      </Button>,
    )
    fireEvent.click(getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has no WCAG AAA violations in any variant, including disabled', async () => {
    const { container } = render(
      <>
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            Claim
          </Button>
        ))}
        <Button disabled>Claim</Button>
      </>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
