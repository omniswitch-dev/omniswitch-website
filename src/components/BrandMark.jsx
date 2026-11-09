import { markPath } from '../data/brand.js'

export default function BrandMark({ className = '', size = 32 }) {
  return (
    <svg
      className={`brand-mark ${className}`}
      width={size}
      height={(size * 72) / 64}
      viewBox="0 0 64 72"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={markPath} />
      <path d={markPath} transform="rotate(180 32 36)" />
    </svg>
  )
}
