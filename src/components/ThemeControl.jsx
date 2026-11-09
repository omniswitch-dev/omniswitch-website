import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { applyThemeColor } from '../theme.js'

export default function ThemeControl() {
  const [preference, setPreference] = useState('light')

  useEffect(() => {
    setPreference(document.documentElement.dataset.themePreference || 'light')
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    function update() {
      const current = document.documentElement.dataset.themePreference || 'light'
      document.documentElement.dataset.theme =
        current === 'system' ? (system.matches ? 'dark' : 'light') : current
      applyThemeColor()
    }
    function sync(event) {
      if (event.key !== 'omniswitch-theme' && event.key !== null) return
      const next = ['light', 'dark', 'system'].includes(event.newValue) ? event.newValue : 'light'
      document.documentElement.dataset.themePreference = next
      setPreference(next)
      update()
    }
    update()
    system.addEventListener('change', update)
    window.addEventListener('storage', sync)
    return () => {
      system.removeEventListener('change', update)
      window.removeEventListener('storage', sync)
    }
  }, [])

  function change(event) {
    const next = event.target.value
    setPreference(next)
    document.documentElement.dataset.themePreference = next
    document.documentElement.dataset.theme =
      next === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : next
    try {
      localStorage.setItem('omniswitch-theme', next)
    } catch {}
    applyThemeColor()
  }

  const Icon = preference === 'light' ? Sun : preference === 'dark' ? Moon : Monitor
  return (
    <label className="theme-control">
      <Icon className="icon" aria-hidden="true" />
      <span className="sr-only">Color theme</span>
      <select value={preference} onChange={change}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  )
}
